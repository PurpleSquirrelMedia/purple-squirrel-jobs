/**
 * Job Aggregation Service
 *
 * Aggregates jobs from multiple sources:
 * - RemoteOK API (free, no auth)
 * - Hacker News Who's Hiring (scraping)
 * - GitHub Jobs (API)
 * - We Work Remotely (scraping)
 *
 * For production, add:
 * - LinkedIn Jobs API (requires partnership)
 * - Indeed API (requires partnership)
 * - Greenhouse/Lever APIs (for ATS integrations)
 */

import axios from "axios";
import * as cheerio from "cheerio";
import db from "../db";

interface AggregatedJob {
  title: string;
  company: string;
  companyLogo?: string;
  location: string | null;
  remote: "ONSITE" | "HYBRID" | "REMOTE";
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  sourceUrl: string;
  sourcePlatform: string;
  externalId: string;
  postedAt: Date;
}

// Rate limiting helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch jobs from RemoteOK API (free, no auth required)
 */
async function fetchRemoteOKJobs(): Promise<AggregatedJob[]> {
  try {
    const response = await axios.get("https://remoteok.com/api", {
      headers: {
        "User-Agent": "PurpleSquirrel/1.0",
      },
    });

    // First item is metadata, rest are jobs
    const jobs = response.data.slice(1);

    return jobs.slice(0, 50).map((job: Record<string, unknown>) => ({
      title: job.position as string,
      company: job.company as string,
      companyLogo: job.company_logo as string | undefined,
      location: (job.location as string) || "Remote",
      remote: "REMOTE" as const,
      description: (job.description as string) || "",
      salaryMin: job.salary_min ? parseInt(job.salary_min as string) : undefined,
      salaryMax: job.salary_max ? parseInt(job.salary_max as string) : undefined,
      skills: (job.tags as string[]) || [],
      sourceUrl: job.url as string,
      sourcePlatform: "remoteok",
      externalId: job.id?.toString() || "",
      postedAt: new Date((job.date as string) || Date.now()),
    }));
  } catch (error) {
    console.error("Error fetching RemoteOK jobs:", error);
    return [];
  }
}

/**
 * Scrape Hacker News "Who's Hiring" thread
 */
async function fetchHNJobs(): Promise<AggregatedJob[]> {
  try {
    // Get the latest "Who's Hiring" thread
    const searchUrl =
      "https://hn.algolia.com/api/v1/search_by_date?query=Ask%20HN:%20Who%20is%20hiring&tags=story";
    const searchResponse = await axios.get(searchUrl);
    const stories = searchResponse.data.hits;

    if (!stories.length) return [];

    // Get the most recent thread
    const latestThread = stories[0];
    const threadUrl = `https://hn.algolia.com/api/v1/items/${latestThread.objectID}`;
    const threadResponse = await axios.get(threadUrl);
    const comments = threadResponse.data.children || [];

    const jobs: AggregatedJob[] = [];

    for (const comment of comments.slice(0, 100)) {
      if (!comment.text) continue;

      // Parse HN job posting format: Company | Location | Role | ...
      const text = comment.text.replace(/<[^>]*>/g, " ").trim();
      const lines = text.split("|").map((s: string) => s.trim());

      if (lines.length < 2) continue;

      const company = lines[0];
      const title = lines.length > 2 ? lines[2] : lines[1];
      const location = lines.length > 1 ? lines[1] : "Unknown";

      // Determine remote status
      const isRemote =
        location.toLowerCase().includes("remote") ||
        text.toLowerCase().includes("remote");

      // Extract skills (basic keyword matching)
      const skillKeywords = [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "Go",
        "Rust",
        "Java",
        "C++",
        "AWS",
        "Kubernetes",
        "Docker",
        "PostgreSQL",
        "MongoDB",
        "GraphQL",
        "REST",
        "Machine Learning",
        "AI",
      ];
      const skills = skillKeywords.filter((skill) =>
        text.toLowerCase().includes(skill.toLowerCase())
      );

      jobs.push({
        title: title || "Software Engineer",
        company,
        location,
        remote: isRemote ? "REMOTE" : "ONSITE",
        description: text.substring(0, 500),
        skills,
        sourceUrl: `https://news.ycombinator.com/item?id=${comment.id}`,
        sourcePlatform: "hackernews",
        externalId: comment.id.toString(),
        postedAt: new Date(comment.created_at_i * 1000),
      });
    }

    return jobs;
  } catch (error) {
    console.error("Error fetching HN jobs:", error);
    return [];
  }
}

/**
 * Scrape We Work Remotely
 */
async function fetchWWRJobs(): Promise<AggregatedJob[]> {
  try {
    const response = await axios.get(
      "https://weworkremotely.com/categories/remote-programming-jobs",
      {
        headers: {
          "User-Agent": "PurpleSquirrel/1.0",
        },
      }
    );

    const $ = cheerio.load(response.data);
    const jobs: AggregatedJob[] = [];

    $("li.feature, li:not(.view-all)").each((_, element) => {
      const $el = $(element);
      const $link = $el.find("a").first();

      if (!$link.length) return;

      const title = $el.find(".title").text().trim();
      const company = $el.find(".company").text().trim();
      const href = $link.attr("href");

      if (!title || !company || !href) return;

      jobs.push({
        title,
        company,
        location: "Remote",
        remote: "REMOTE",
        description: "",
        skills: [],
        sourceUrl: `https://weworkremotely.com${href}`,
        sourcePlatform: "weworkremotely",
        externalId: href,
        postedAt: new Date(),
      });
    });

    return jobs.slice(0, 50);
  } catch (error) {
    console.error("Error fetching WWR jobs:", error);
    return [];
  }
}

/**
 * Main aggregation function
 */
export async function aggregateJobs(): Promise<{
  total: number;
  sources: Record<string, number>;
}> {
  console.log("Starting job aggregation...");

  const sources: Record<string, number> = {};

  // Fetch from all sources in parallel
  const [remoteOKJobs, hnJobs, wwrJobs] = await Promise.all([
    fetchRemoteOKJobs(),
    fetchHNJobs(),
    fetchWWRJobs(),
  ]);

  sources.remoteok = remoteOKJobs.length;
  sources.hackernews = hnJobs.length;
  sources.weworkremotely = wwrJobs.length;

  const allJobs = [...remoteOKJobs, ...hnJobs, ...wwrJobs];

  console.log(`Aggregated ${allJobs.length} jobs from ${Object.keys(sources).length} sources`);

  // Store jobs (in production, use upsert to avoid duplicates)
  let added = 0;
  for (const job of allJobs) {
    // Check if job already exists (by external ID and platform)
    const existing = db.jobs.findAll().find(
      (j) => j.sourcePlatform === job.sourcePlatform && j.externalId === job.externalId
    );

    if (!existing) {
      // Find or create company
      let company = db.companies.findBySlug(
        job.company.toLowerCase().replace(/[^a-z0-9]/g, "-")
      );

      if (!company) {
        company = db.companies.create({
          name: job.company,
          slug: job.company.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          description: null,
          website: null,
          logoUrl: job.companyLogo || null,
          verified: false,
        });
      }

      db.jobs.create({
        companyId: company.id,
        title: job.title,
        slug: job.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        description: job.description,
        location: job.location,
        remote: job.remote,
        employmentType: "FULL_TIME",
        salaryMin: job.salaryMin || null,
        salaryMax: job.salaryMax || null,
        salaryCurrency: "USD",
        experienceMin: null,
        experienceMax: null,
        status: "ACTIVE",
        sourceUrl: job.sourceUrl,
        sourcePlatform: job.sourcePlatform,
        externalId: job.externalId,
        skills: job.skills,
        postedAt: job.postedAt,
        company: {
          name: company.name,
          logo: company.logoUrl,
          verified: company.verified,
        },
      });

      added++;
    }
  }

  console.log(`Added ${added} new jobs to database`);

  return {
    total: allJobs.length,
    sources,
  };
}

export default aggregateJobs;
