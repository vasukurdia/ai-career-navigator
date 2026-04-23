"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Compass,
  FileText,
  MessageSquare,
  Map,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MessageSquare,
    title: "AI Career Advisor",
    desc: "Chat with Gemini AI for personalized career guidance, interview prep, and job search strategies.",
    color: "bg-teal-50 text-teal-700",
  },
  {
    icon: FileText,
    title: "Resume Analyzer",
    desc: "Upload your resume for instant AI feedback, ATS scoring, and actionable improvement tips.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Map,
    title: "Career Roadmaps",
    desc: "Get personalized step-by-step roadmaps to reach your target role with clear timelines.",
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    desc: "Identify missing skills and get curated learning resources to bridge the gap faster.",
    color: "bg-amber-50 text-amber-700",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-hero">
      <div className="fixed inset-0 dot-pattern opacity-30 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 glass border-b border-white/60 sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              AI Career<span className="text-gradient"> Navigator</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gradient-primary text-white border-0 hover:opacity-90">
                  Get Started Free
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm" className="gradient-primary text-white border-0 hover:opacity-90">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/70 border border-teal-200 rounded-full px-4 py-1.5 text-sm text-teal-700 font-medium mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight mb-6">
            Your AI-Powered
            <br />
            <em className="text-gradient not-italic">Career Partner</em>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Get personalized career advice, instant resume feedback, and
            step-by-step roadmaps — all in one place, powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                className="gradient-primary text-white border-0 hover:opacity-90 px-8 h-12 text-base shadow-lg shadow-teal-200/50"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base bg-white/60 hover:bg-white/80 border-slate-200"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Everything you need to grow
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Four powerful AI tools built to help you at every stage of your career journey.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="bg-white/75 border border-white/80 rounded-2xl p-6 card-hover shadow-sm"
            >
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-primary rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Ready to take the next step?
            </h2>
            <p className="text-teal-100 mb-8 max-w-lg mx-auto">
              Sign up free and let AI guide your career decisions — from resume
              to roadmap, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              {["No credit card needed", "Free to use", "Setup in 2 minutes"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-200" />
                  {t}
                </div>
              ))}
            </div>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-teal-50 border-0 px-8 h-12 text-base font-semibold shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/60 bg-white/40 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-600" />
            <span className="font-display font-medium text-foreground">CareerNav AI</span>
          </div>
          <span>© {new Date().getFullYear()} CareerNav AI. Built with Next.js & Gemini.</span>
        </div>
      </footer>
    </div>
  );
}