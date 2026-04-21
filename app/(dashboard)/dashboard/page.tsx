"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Map,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

const quickActions = [
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Ask AI Advisor",
    desc: "Get instant career guidance",
    color: "bg-teal-500",
    light: "bg-teal-50 text-teal-700",
  },
  {
    href: "/resume",
    icon: FileText,
    label: "Analyze Resume",
    desc: "Get AI-powered feedback",
    color: "bg-blue-500",
    light: "bg-blue-50 text-blue-700",
  },
  {
    href: "/roadmap",
    icon: Map,
    label: "Build Roadmap",
    desc: "Plan your career path",
    color: "bg-indigo-500",
    light: "bg-indigo-50 text-indigo-700",
  },
  {
    href: "/profile",
    icon: TrendingUp,
    label: "Update Profile",
    desc: "Set your goals & skills",
    color: "bg-amber-500",
    light: "bg-amber-50 text-amber-700",
  },
];

const tips = [
  {
    icon: Zap,
    title: "Complete your profile",
    desc: "Add your current role and target role for personalized AI advice.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Target,
    title: "Upload your resume",
    desc: "Get an ATS score and actionable improvements within seconds.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: Clock,
    title: "Build a roadmap",
    desc: "Set a target role and let AI plan every step of your journey.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden gradient-primary rounded-2xl p-8 text-white"
      >
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative">
          <p className="text-teal-200 text-sm font-medium mb-1">Welcome back</p>
          <h1 className="font-display text-3xl font-semibold mb-2">
            {user?.firstName ? `Hey, ${user.firstName}!` : "Welcome to CareerNav AI"}
          </h1>
          <p className="text-teal-100 text-sm max-w-md leading-relaxed">
            Your AI-powered career partner is ready. Start by chatting with the
            advisor, analyzing your resume, or building a roadmap.
          </p>
          <div className="mt-5 flex gap-3">
            <Link href="/chat">
              <Button
                size="sm"
                className="bg-white text-teal-700 hover:bg-teal-50 border-0 font-semibold shadow-md"
              >
                Start Chatting
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/resume">
              <Button
                size="sm"
                variant="outline"
                className="border-teal-300/50 text-white hover:bg-teal-600/30 bg-white/10 backdrop-blur-sm"
              >
                Analyze Resume
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickActions.map((action) => (
            <motion.div key={action.href} variants={item}>
              <Link href={action.href}>
                <div className="group bg-white/80 border border-slate-200 rounded-2xl p-5 card-hover cursor-pointer h-full">
                  <div
                    className={`w-10 h-10 rounded-xl ${action.light} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-sm text-foreground mb-1">
                    {action.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{action.desc}</div>
                  <div className="mt-3 flex items-center text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Getting Started Tips */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Getting Started
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-4"
        >
          {tips.map((tip, i) => (
            <motion.div
              key={tip.title}
              variants={item}
              className="bg-white/80 border border-slate-200 rounded-2xl p-5 flex gap-4"
            >
              <div
                className={`w-9 h-9 rounded-xl ${tip.bg} flex items-center justify-center flex-shrink-0`}
              >
                <tip.icon className={`w-4 h-4 ${tip.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted-foreground">
                    STEP {i + 1}
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  {tip.title}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {tip.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
