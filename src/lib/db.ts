// Temporary in-memory storage for MVP
// TODO: Replace with Prisma/PostgreSQL when database is set up

interface WaitlistEntry {
  id: string;
  email: string;
  userType: "CANDIDATE" | "EMPLOYER";
  createdAt: Date;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string | null;
  avatar: string | null;
  userType: "CANDIDATE" | "EMPLOYER";
  createdAt: Date;
}

interface Job {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  remote: "ONSITE" | "HYBRID" | "REMOTE";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP";
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  experienceMin: number | null;
  experienceMax: number | null;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  sourceUrl: string | null;
  sourcePlatform: string | null;
  externalId: string | null;
  skills: string[];
  postedAt: Date;
  createdAt: Date;
  company: {
    name: string;
    logo: string | null;
    verified: boolean;
  };
}

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  verified: boolean;
  createdAt: Date;
}

const waitlist: WaitlistEntry[] = [];
const users: User[] = [];
const jobs: Job[] = [];
const companies: Company[] = [];

// Seed some demo companies
const seedCompanies: Company[] = [
  { id: "c1", name: "Stripe", slug: "stripe", description: "Financial infrastructure for the internet", website: "https://stripe.com", logoUrl: "https://logo.clearbit.com/stripe.com", verified: true, createdAt: new Date() },
  { id: "c2", name: "Figma", slug: "figma", description: "Collaborative design tool", website: "https://figma.com", logoUrl: "https://logo.clearbit.com/figma.com", verified: true, createdAt: new Date() },
  { id: "c3", name: "Vercel", slug: "vercel", description: "Frontend cloud platform", website: "https://vercel.com", logoUrl: "https://logo.clearbit.com/vercel.com", verified: true, createdAt: new Date() },
  { id: "c4", name: "Coinbase", slug: "coinbase", description: "Cryptocurrency exchange", website: "https://coinbase.com", logoUrl: "https://logo.clearbit.com/coinbase.com", verified: true, createdAt: new Date() },
  { id: "c5", name: "Datadog", slug: "datadog", description: "Cloud monitoring platform", website: "https://datadog.com", logoUrl: "https://logo.clearbit.com/datadog.com", verified: true, createdAt: new Date() },
];

// Seed some demo jobs
const seedJobs: Job[] = [
  {
    id: "j1", companyId: "c1", title: "Senior Frontend Engineer", slug: "senior-frontend-engineer",
    description: "Build the future of financial infrastructure with React and TypeScript.",
    location: "San Francisco, CA", remote: "HYBRID", employmentType: "FULL_TIME",
    salaryMin: 180000, salaryMax: 250000, salaryCurrency: "USD",
    experienceMin: 5, experienceMax: null, status: "ACTIVE",
    sourceUrl: null, sourcePlatform: null, externalId: null,
    skills: ["React", "TypeScript", "GraphQL"],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), createdAt: new Date(),
    company: { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com", verified: true }
  },
  {
    id: "j2", companyId: "c2", title: "Staff Software Engineer - Platform", slug: "staff-software-engineer-platform",
    description: "Work on the core platform that powers collaborative design.",
    location: "New York, NY", remote: "REMOTE", employmentType: "FULL_TIME",
    salaryMin: 200000, salaryMax: 280000, salaryCurrency: "USD",
    experienceMin: 7, experienceMax: null, status: "ACTIVE",
    sourceUrl: null, sourcePlatform: null, externalId: null,
    skills: ["Rust", "TypeScript", "WebAssembly"],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), createdAt: new Date(),
    company: { name: "Figma", logo: "https://logo.clearbit.com/figma.com", verified: true }
  },
  {
    id: "j3", companyId: "c3", title: "Full Stack Developer", slug: "full-stack-developer",
    description: "Build the next generation of web development tools.",
    location: "Remote", remote: "REMOTE", employmentType: "FULL_TIME",
    salaryMin: 150000, salaryMax: 200000, salaryCurrency: "USD",
    experienceMin: 3, experienceMax: null, status: "ACTIVE",
    sourceUrl: null, sourcePlatform: null, externalId: null,
    skills: ["Next.js", "Node.js", "PostgreSQL"],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), createdAt: new Date(),
    company: { name: "Vercel", logo: "https://logo.clearbit.com/vercel.com", verified: true }
  },
  {
    id: "j4", companyId: "c4", title: "Blockchain Engineer", slug: "blockchain-engineer",
    description: "Build secure, scalable blockchain infrastructure.",
    location: "San Francisco, CA", remote: "HYBRID", employmentType: "FULL_TIME",
    salaryMin: 170000, salaryMax: 240000, salaryCurrency: "USD",
    experienceMin: 4, experienceMax: null, status: "ACTIVE",
    sourceUrl: null, sourcePlatform: null, externalId: null,
    skills: ["Solidity", "Rust", "Go"],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), createdAt: new Date(),
    company: { name: "Coinbase", logo: "https://logo.clearbit.com/coinbase.com", verified: true }
  },
  {
    id: "j5", companyId: "c5", title: "DevOps Engineer", slug: "devops-engineer",
    description: "Scale cloud infrastructure for millions of customers.",
    location: "Boston, MA", remote: "ONSITE", employmentType: "FULL_TIME",
    salaryMin: 140000, salaryMax: 190000, salaryCurrency: "USD",
    experienceMin: 3, experienceMax: null, status: "ACTIVE",
    sourceUrl: null, sourcePlatform: null, externalId: null,
    skills: ["Kubernetes", "Terraform", "AWS"],
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), createdAt: new Date(),
    company: { name: "Datadog", logo: "https://logo.clearbit.com/datadog.com", verified: true }
  },
];

// Initialize with seed data
companies.push(...seedCompanies);
jobs.push(...seedJobs);

export const db = {
  waitlist: {
    findByEmail: (email: string) => waitlist.find((e) => e.email === email),
    create: (data: Omit<WaitlistEntry, "id" | "createdAt">) => {
      const entry: WaitlistEntry = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...data,
      };
      waitlist.push(entry);
      return entry;
    },
    count: () => waitlist.length,
  },

  users: {
    findByEmail: (email: string) => users.find((u) => u.email === email),
    findById: (id: string) => users.find((u) => u.id === id),
    create: (data: Omit<User, "id" | "createdAt">) => {
      const user: User = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...data,
      };
      users.push(user);
      return user;
    },
    count: () => users.length,
  },

  jobs: {
    findAll: (filters?: {
      search?: string;
      location?: string;
      remote?: string;
      employmentType?: string;
    }) => {
      let result = [...jobs];

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(
          (j) =>
            j.title.toLowerCase().includes(search) ||
            j.company.name.toLowerCase().includes(search) ||
            j.skills.some((s) => s.toLowerCase().includes(search))
        );
      }

      if (filters?.location) {
        const loc = filters.location.toLowerCase();
        result = result.filter((j) => j.location?.toLowerCase().includes(loc));
      }

      if (filters?.remote && filters.remote !== "all") {
        result = result.filter((j) => j.remote === filters.remote);
      }

      if (filters?.employmentType && filters.employmentType !== "all") {
        result = result.filter((j) => j.employmentType === filters.employmentType);
      }

      return result.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    },
    findById: (id: string) => jobs.find((j) => j.id === id),
    create: (data: Omit<Job, "id" | "createdAt">) => {
      const job: Job = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...data,
      };
      jobs.push(job);
      return job;
    },
    count: () => jobs.length,
  },

  companies: {
    findAll: () => [...companies],
    findById: (id: string) => companies.find((c) => c.id === id),
    findBySlug: (slug: string) => companies.find((c) => c.slug === slug),
    create: (data: Omit<Company, "id" | "createdAt">) => {
      const company: Company = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...data,
      };
      companies.push(company);
      return company;
    },
  },
};

export default db;
