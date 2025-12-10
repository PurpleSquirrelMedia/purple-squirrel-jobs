"use client";

import { useState } from "react";
import { Search, Sparkles, Users, Zap, CheckCircle, ArrowRight, Globe, Brain, Shield } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"candidate" | "employer">("candidate");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userType: userType.toUpperCase(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <span className="text-xl">🐿️</span>
            </div>
            <span className="text-xl font-bold text-white">Purple Squirrel</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a>
            <a href="#waitlist" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition">
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Talent Matching
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your{" "}
              <span className="gradient-text">Unicorn</span>
              <br />Talent
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Stop scrolling through endless job boards. Purple Squirrel aggregates the best tech opportunities
              and uses AI to match exceptional candidates with their perfect roles.
            </p>

            {/* Waitlist Form */}
            <div id="waitlist" className="max-w-md mx-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* User Type Toggle */}
                  <div className="flex bg-slate-800/50 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setUserType("candidate")}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        userType === "candidate"
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      I&apos;m a Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("employer")}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        userType === "employer"
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      I&apos;m Hiring
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 rounded-xl text-white font-medium transition flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Join <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">You&apos;re on the list! We&apos;ll be in touch soon.</span>
                </div>
              )}

              <p className="text-gray-500 text-sm mt-4">
                Join 1,200+ tech professionals already on the waitlist
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { value: "50K+", label: "Jobs Aggregated" },
              { value: "15+", label: "Job Boards" },
              { value: "98%", label: "Match Accuracy" },
              { value: "3 days", label: "Avg. Time to Hire" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Purple Squirrel?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We&apos;re not just another job board. We&apos;re building the future of tech recruiting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Universal Aggregation",
                description: "One place for LinkedIn, Indeed, Greenhouse, Lever, and 15+ job boards. Never miss an opportunity.",
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "AI-Powered Matching",
                description: "Our algorithms find the 'purple squirrel' matches that keyword searches miss.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Candidate-First",
                description: "You control your data. Companies compete for your attention, not the other way around.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Curated Quality",
                description: "No spam. No fake listings. Every job is verified and every candidate is vetted.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/50 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Whether you&apos;re hunting for your dream job or your dream hire, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Candidates */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <Search className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">For Candidates</h3>
              </div>
              {[
                { step: "1", title: "Create Your Profile", desc: "Tell us about your skills, experience, and what you're looking for." },
                { step: "2", title: "Get AI Matches", desc: "Our algorithm scans 50K+ jobs daily to find your perfect fit." },
                { step: "3", title: "Apply with One Click", desc: "Streamlined applications to multiple companies simultaneously." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* For Employers */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <Zap className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">For Employers</h3>
              </div>
              {[
                { step: "1", title: "Post Your Role", desc: "Describe your ideal candidate - even the 'purple squirrel' requirements." },
                { step: "2", title: "AI Finds Matches", desc: "We surface candidates you'd never find through traditional search." },
                { step: "3", title: "Interview the Best", desc: "Pre-vetted, interested candidates delivered to your inbox." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-900/50 to-violet-900/50 border border-purple-500/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find Your Purple Squirrel?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Join the waitlist today and be the first to access the future of tech recruiting.
            </p>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-semibold transition"
            >
              Join the Waitlist <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <span className="text-sm">🐿️</span>
            </div>
            <span className="font-semibold text-white">Purple Squirrel</span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Purple Squirrel. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
