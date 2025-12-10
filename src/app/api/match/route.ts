import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { matchCandidateToJobsSimple } from "@/lib/services/ai-matching";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile } = body;

    if (!profile) {
      return NextResponse.json(
        { error: "Candidate profile is required" },
        { status: 400 }
      );
    }

    // Get all active jobs
    const jobs = db.jobs.findAll();

    // Convert to matching format
    const jobsForMatching = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      skills: job.skills,
      experienceMin: job.experienceMin || undefined,
      experienceMax: job.experienceMax || undefined,
      location: job.location || undefined,
      remote: job.remote,
      salaryMin: job.salaryMin || undefined,
      salaryMax: job.salaryMax || undefined,
      company: job.company,
    }));

    // Use simple matching (no OpenAI API key needed)
    // In production, use matchCandidateToJobs for better results
    const matches = matchCandidateToJobsSimple(profile, jobsForMatching);

    // Return top 20 matches
    const topMatches = matches.slice(0, 20);

    // Enrich with job details
    const enrichedMatches = topMatches.map((match) => {
      const job = jobs.find((j) => j.id === match.jobId);
      return {
        ...match,
        job,
      };
    });

    return NextResponse.json({
      matches: enrichedMatches,
      total: enrichedMatches.length,
    });
  } catch (error) {
    console.error("Error matching jobs:", error);
    return NextResponse.json(
      { error: "Failed to match jobs" },
      { status: 500 }
    );
  }
}
