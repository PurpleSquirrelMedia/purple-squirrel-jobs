/**
 * AI Matching Service
 *
 * Uses OpenAI embeddings to match candidates with jobs based on:
 * - Skills overlap
 * - Experience level
 * - Job description similarity to candidate profile
 * - Location/remote preferences
 *
 * Scoring components:
 * - Semantic similarity (embeddings): 40%
 * - Skills match: 30%
 * - Experience fit: 15%
 * - Location match: 15%
 */

import OpenAI from "openai";

// Lazy initialization to avoid build-time errors when env var is missing
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }
  return openaiClient;
}

interface CandidateProfile {
  headline: string;
  bio: string;
  skills: string[];
  yearsExperience: number;
  desiredRoles: string[];
  desiredLocations: string[];
  remoteOnly: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

interface JobListing {
  id: string;
  title: string;
  description: string;
  skills: string[];
  experienceMin?: number;
  experienceMax?: number;
  location?: string;
  remote: "ONSITE" | "HYBRID" | "REMOTE";
  salaryMin?: number;
  salaryMax?: number;
  company: {
    name: string;
  };
}

interface MatchResult {
  jobId: string;
  score: number;
  breakdown: {
    semantic: number;
    skills: number;
    experience: number;
    location: number;
    salary: number;
  };
  reasoning: string;
}

/**
 * Generate embeddings for text using OpenAI
 */
async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await getOpenAI().embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return [];
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Calculate skills overlap score
 */
function calculateSkillsScore(
  candidateSkills: string[],
  jobSkills: string[]
): number {
  if (jobSkills.length === 0) return 0.7; // No required skills = moderate match

  const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
  const jobSkillsLower = jobSkills.map((s) => s.toLowerCase());

  let matches = 0;
  for (const skill of jobSkillsLower) {
    if (
      candidateSkillsLower.some(
        (cs) =>
          cs.includes(skill) ||
          skill.includes(cs) ||
          // Handle variations like "React.js" vs "React"
          cs.replace(/[.-]/g, "") === skill.replace(/[.-]/g, "")
      )
    ) {
      matches++;
    }
  }

  return matches / jobSkills.length;
}

/**
 * Calculate experience fit score
 */
function calculateExperienceScore(
  candidateYears: number,
  minRequired?: number,
  maxRequired?: number
): number {
  if (!minRequired && !maxRequired) return 0.8; // No requirements

  const min = minRequired || 0;
  const max = maxRequired || 20;

  if (candidateYears >= min && candidateYears <= max) {
    return 1.0; // Perfect fit
  } else if (candidateYears < min) {
    // Under-qualified: penalty based on how far under
    const gap = min - candidateYears;
    return Math.max(0, 1 - gap * 0.15);
  } else {
    // Over-qualified: smaller penalty
    const gap = candidateYears - max;
    return Math.max(0.5, 1 - gap * 0.05);
  }
}

/**
 * Calculate location match score
 */
function calculateLocationScore(
  candidate: CandidateProfile,
  job: JobListing
): number {
  // Remote-only candidate
  if (candidate.remoteOnly) {
    return job.remote === "REMOTE" ? 1.0 : job.remote === "HYBRID" ? 0.5 : 0;
  }

  // Check location preferences
  if (job.remote === "REMOTE") return 1.0;

  if (!job.location) return 0.7;

  const jobLocationLower = job.location.toLowerCase();
  const hasLocationMatch = candidate.desiredLocations.some((loc) =>
    jobLocationLower.includes(loc.toLowerCase())
  );

  if (hasLocationMatch) return 1.0;
  if (job.remote === "HYBRID") return 0.6;

  return 0.3;
}

/**
 * Calculate salary match score
 */
function calculateSalaryScore(
  candidate: CandidateProfile,
  job: JobListing
): number {
  if (!candidate.salaryMin || (!job.salaryMin && !job.salaryMax)) {
    return 0.7; // No salary info available
  }

  const jobMax = job.salaryMax || job.salaryMin || 0;
  const jobMin = job.salaryMin || job.salaryMax || 0;
  const candidateMin = candidate.salaryMin || 0;
  const candidateMax = candidate.salaryMax || candidateMin * 1.5;

  // Check if ranges overlap
  if (jobMax >= candidateMin && jobMin <= candidateMax) {
    return 1.0;
  }

  // Calculate gap
  if (jobMax < candidateMin) {
    const gap = (candidateMin - jobMax) / candidateMin;
    return Math.max(0, 1 - gap);
  }

  return 0.8; // Job pays more than expected
}

/**
 * Generate human-readable reasoning for the match
 */
function generateReasoning(
  candidate: CandidateProfile,
  job: JobListing,
  breakdown: MatchResult["breakdown"]
): string {
  const reasons: string[] = [];

  // Skills
  if (breakdown.skills >= 0.8) {
    reasons.push("Strong skills match");
  } else if (breakdown.skills >= 0.5) {
    reasons.push("Partial skills overlap");
  }

  // Experience
  if (breakdown.experience >= 0.9) {
    reasons.push("Experience level is a great fit");
  }

  // Location
  if (breakdown.location >= 0.9 && job.remote === "REMOTE") {
    reasons.push("Fully remote position");
  } else if (breakdown.location >= 0.8) {
    reasons.push("Location matches your preferences");
  }

  // Salary
  if (breakdown.salary >= 0.9) {
    reasons.push("Salary within your range");
  }

  return reasons.length > 0
    ? reasons.join(". ") + "."
    : "This role may be a good fit based on your profile.";
}

/**
 * Match a candidate with a list of jobs
 */
export async function matchCandidateToJobs(
  candidate: CandidateProfile,
  jobs: JobListing[]
): Promise<MatchResult[]> {
  // Generate candidate profile embedding
  const candidateText = [
    candidate.headline,
    candidate.bio,
    `Skills: ${candidate.skills.join(", ")}`,
    `Looking for: ${candidate.desiredRoles.join(", ")}`,
    `${candidate.yearsExperience} years of experience`,
  ].join("\n");

  const candidateEmbedding = await getEmbedding(candidateText);

  const results: MatchResult[] = [];

  for (const job of jobs) {
    // Generate job embedding
    const jobText = [
      job.title,
      job.description,
      `Skills: ${job.skills.join(", ")}`,
      `Company: ${job.company.name}`,
      job.location || "Remote",
    ].join("\n");

    const jobEmbedding = await getEmbedding(jobText);

    // Calculate component scores
    const semanticScore =
      candidateEmbedding.length > 0 && jobEmbedding.length > 0
        ? cosineSimilarity(candidateEmbedding, jobEmbedding)
        : 0.5;

    const skillsScore = calculateSkillsScore(candidate.skills, job.skills);
    const experienceScore = calculateExperienceScore(
      candidate.yearsExperience,
      job.experienceMin,
      job.experienceMax
    );
    const locationScore = calculateLocationScore(candidate, job);
    const salaryScore = calculateSalaryScore(candidate, job);

    // Weighted final score
    const finalScore =
      semanticScore * 0.35 +
      skillsScore * 0.3 +
      experienceScore * 0.15 +
      locationScore * 0.12 +
      salaryScore * 0.08;

    const breakdown = {
      semantic: Math.round(semanticScore * 100),
      skills: Math.round(skillsScore * 100),
      experience: Math.round(experienceScore * 100),
      location: Math.round(locationScore * 100),
      salary: Math.round(salaryScore * 100),
    };

    results.push({
      jobId: job.id,
      score: Math.round(finalScore * 100),
      breakdown,
      reasoning: generateReasoning(candidate, job, breakdown),
    });
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Simple matching without OpenAI (for when API is unavailable)
 */
export function matchCandidateToJobsSimple(
  candidate: CandidateProfile,
  jobs: JobListing[]
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const job of jobs) {
    const skillsScore = calculateSkillsScore(candidate.skills, job.skills);
    const experienceScore = calculateExperienceScore(
      candidate.yearsExperience,
      job.experienceMin,
      job.experienceMax
    );
    const locationScore = calculateLocationScore(candidate, job);
    const salaryScore = calculateSalaryScore(candidate, job);

    // Title match
    const titleMatch = candidate.desiredRoles.some(
      (role) =>
        job.title.toLowerCase().includes(role.toLowerCase()) ||
        role.toLowerCase().includes(job.title.toLowerCase())
    )
      ? 0.8
      : 0.4;

    const finalScore =
      titleMatch * 0.35 +
      skillsScore * 0.3 +
      experienceScore * 0.15 +
      locationScore * 0.12 +
      salaryScore * 0.08;

    const breakdown = {
      semantic: Math.round(titleMatch * 100),
      skills: Math.round(skillsScore * 100),
      experience: Math.round(experienceScore * 100),
      location: Math.round(locationScore * 100),
      salary: Math.round(salaryScore * 100),
    };

    results.push({
      jobId: job.id,
      score: Math.round(finalScore * 100),
      breakdown,
      reasoning: generateReasoning(candidate, job, breakdown),
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export default { matchCandidateToJobs, matchCandidateToJobsSimple };
