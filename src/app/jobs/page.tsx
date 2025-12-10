"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Bookmark,
  ExternalLink,
  Filter,
  ChevronDown,
  Briefcase,
  Globe,
  X,
  Sparkles,
} from "lucide-react";

// Mock data - will be replaced with API calls
const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com", verified: true },
    location: "San Francisco, CA",
    remote: "HYBRID",
    salaryMin: 180000,
    salaryMax: 250000,
    employmentType: "FULL_TIME",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    skills: ["React", "TypeScript", "GraphQL"],
    matchScore: 94,
    featured: true,
  },
  {
    id: "2",
    title: "Staff Software Engineer - Platform",
    company: { name: "Figma", logo: "https://logo.clearbit.com/figma.com", verified: true },
    location: "New York, NY",
    remote: "REMOTE",
    salaryMin: 200000,
    salaryMax: 280000,
    employmentType: "FULL_TIME",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    skills: ["Rust", "TypeScript", "WebAssembly"],
    matchScore: 89,
    featured: false,
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: { name: "Vercel", logo: "https://logo.clearbit.com/vercel.com", verified: true },
    location: "Remote",
    remote: "REMOTE",
    salaryMin: 150000,
    salaryMax: 200000,
    employmentType: "FULL_TIME",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    skills: ["Next.js", "Node.js", "PostgreSQL"],
    matchScore: 92,
    featured: false,
  },
  {
    id: "4",
    title: "Blockchain Engineer",
    company: { name: "Coinbase", logo: "https://logo.clearbit.com/coinbase.com", verified: true },
    location: "San Francisco, CA",
    remote: "HYBRID",
    salaryMin: 170000,
    salaryMax: 240000,
    employmentType: "FULL_TIME",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    skills: ["Solidity", "Rust", "Go"],
    matchScore: 87,
    featured: true,
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: { name: "Datadog", logo: "https://logo.clearbit.com/datadog.com", verified: true },
    location: "Boston, MA",
    remote: "ONSITE",
    salaryMin: 140000,
    salaryMax: 190000,
    employmentType: "FULL_TIME",
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    skills: ["Kubernetes", "Terraform", "AWS"],
    matchScore: 78,
    featured: false,
  },
];

const REMOTE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

const EMPLOYMENT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
];

function formatSalary(min?: number, max?: number) {
  if (!min && !max) return null;
  const format = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${format(min)} - ${format(max)}`;
  if (min) return `${format(min)}+`;
  return `Up to ${format(max!)}`;
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const days = Math.floor(seconds / 86400);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function JobCard({ job }: { job: (typeof MOCK_JOBS)[0] }) {
  const [saved, setSaved] = useState(false);

  return (
    <div
      className={`p-6 rounded-2xl border transition-all hover:border-purple-500/50 ${
        job.featured
          ? "bg-gradient-to-r from-purple-900/20 to-slate-800/30 border-purple-500/30"
          : "bg-slate-800/30 border-slate-700/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.name)}&background=7c3aed&color=fff`;
              }}
            />
          </div>

          {/* Job Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition cursor-pointer">
                {job.title}
              </h3>
              {job.featured && (
                <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-gray-400 text-sm mb-3">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.company.name}
                {job.company.verified && (
                  <span className="text-blue-400" title="Verified">
                    ✓
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeAgo(job.postedAt)}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Remote badge */}
              <span
                className={`px-2 py-1 text-xs rounded-lg ${
                  job.remote === "REMOTE"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : job.remote === "HYBRID"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                }`}
              >
                <Globe className="w-3 h-3 inline mr-1" />
                {job.remote === "REMOTE" ? "Remote" : job.remote === "HYBRID" ? "Hybrid" : "On-site"}
              </span>

              {/* Salary */}
              {formatSalary(job.salaryMin, job.salaryMax) && (
                <span className="px-2 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-3 h-3 inline" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              )}

              {/* Skills */}
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-lg bg-slate-700/50 text-gray-300 border border-slate-600/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-3">
          {/* Match Score */}
          {job.matchScore && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{job.matchScore}% Match</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-lg transition ${
                saved
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-slate-700/50 text-gray-400 hover:text-white"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm font-medium transition flex items-center gap-2">
              Apply <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [remoteFilter, setRemoteFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter jobs
  const filteredJobs = MOCK_JOBS.filter((job) => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    if (remoteFilter !== "all" && job.remote !== remoteFilter) {
      return false;
    }
    if (employmentFilter !== "all" && job.employmentType !== employmentFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <span className="text-xl">🐿️</span>
            </div>
            <span className="text-xl font-bold text-white">Purple Squirrel</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-purple-400 font-medium">
              Jobs
            </Link>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Companies
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              For Employers
            </a>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Search Header */}
      <section className="pt-28 pb-8 px-6 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Next Role</h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, company, or keywords"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div className="md:w-64 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-xl border transition flex items-center gap-2 ${
                showFilters
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-slate-800/50 border-slate-700 text-gray-400 hover:text-white"
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex flex-wrap gap-6">
                {/* Remote Filter */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Work Style</label>
                  <div className="flex gap-2">
                    {REMOTE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setRemoteFilter(option.value)}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          remoteFilter === option.value
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700/50 text-gray-400 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Employment Type Filter */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Employment Type</label>
                  <div className="flex gap-2">
                    {EMPLOYMENT_TYPES.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setEmploymentFilter(option.value)}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          employmentFilter === option.value
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700/50 text-gray-400 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setRemoteFilter("all");
                      setEmploymentFilter("all");
                      setSearchQuery("");
                      setLocation("");
                    }}
                    className="px-3 py-2 text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              <span className="text-white font-medium">{filteredJobs.length}</span> jobs found
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Sort by:</span>
              <select className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500">
                <option value="match">Best Match</option>
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredJobs.length > 0 && (
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-white font-medium transition">
                Load More Jobs
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
