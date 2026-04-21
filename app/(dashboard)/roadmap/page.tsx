"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map, Loader2, ChevronRight, Clock, BookOpen,
  CheckCircle2, Circle, Sparkles, Trash2, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type RoadmapStep = {
  phase: string;
  duration: string;
  title: string;
  description: string;
  tasks: string[];
  resources: string[];
};

type RoadmapData = {
  id?: string;
  title?: string;
  targetRole: string;
  timeframe: string;
  overview: string;
  steps: RoadmapStep[];
  completedSteps?: number[];
  createdAt?: string;
};

const TIMEFRAMES = [
  { value: "3months", label: "3 Months" },
  { value: "6months", label: "6 Months" },
  { value: "1year", label: "1 Year" },
  { value: "2years", label: "2 Years" },
];

const POPULAR_ROLES = [
  "Software Engineer", "Product Manager", "Data Scientist",
  "UX Designer", "DevOps Engineer", "Full Stack Developer",
  "Machine Learning Engineer", "Engineering Manager",
];

export default function RoadmapPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timeframe, setTimeframe] = useState("6months");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<RoadmapData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/roadmap/list");
      const data = await res.json();
      setSavedRoadmaps(data.roadmaps || []);
    } finally {
      setLoadingList(false);
    }
  };

  const generate = async () => {
    if (!targetRole.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentRole, targetRole, timeframe }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setRoadmap(data);
      setCompletedSteps(new Set());
      fetchSaved();
    } catch {
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSaved = (r: RoadmapData) => {
    setRoadmap({ ...r, steps: r.steps as RoadmapStep[] });
    setCompletedSteps(new Set(r.completedSteps || []));
  };

  const deleteRoadmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/roadmap/list?id=${id}`, { method: "DELETE" });
    setSavedRoadmaps((prev) => prev.filter((r) => r.id !== id));
    if (roadmap?.id === id) setRoadmap(null);
  };

  const toggleStep = async (i: number) => {
    const next = new Set(completedSteps);
    next.has(i) ? next.delete(i) : next.add(i);
    setCompletedSteps(next);

    // DB mein save karo agar roadmap saved hai
    if (roadmap?.id) {
      await fetch("/api/roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId: roadmap.id,
          completedSteps: Array.from(next),
        }),
      });
    }
  };

  const tfLabel = (val: string) => TIMEFRAMES.find((t) => t.value === val)?.label || val;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Career Roadmap Builder</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Generate and save personalized career roadmaps.
        </p>
      </div>

      {!roadmap && (
        <>
          {savedRoadmaps.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Your Saved Roadmaps</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {savedRoadmaps.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => loadSaved(r)}
                    className="group bg-white/80 border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                        <Map className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{r.targetRole}</div>
                        <div className="text-xs text-muted-foreground">{tfLabel(r.timeframe)}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteRoadmap(r.id!, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
          >
            <h2 className="text-sm font-semibold text-foreground">Generate New Roadmap</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Current Role (optional)</Label>
                <Input
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Junior Developer"
                  className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-teal-400/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Target Role <span className="text-red-400">*</span></Label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Product Manager"
                  className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-teal-400/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAMES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Popular roles
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setTargetRole(r)}
                    className={`text-xs rounded-xl px-3 py-1.5 border transition-all ${
                      targetRole === r
                        ? "bg-teal-50 border-teal-300 text-teal-700"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-600"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}

            <Button
              onClick={generate}
              disabled={!targetRole.trim() || isGenerating}
              className="w-full gradient-primary text-white border-0 hover:opacity-90 h-11 text-base font-medium rounded-xl shadow-md shadow-teal-200/40"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
              ) : (
                <><Map className="w-4 h-4 mr-2" />Generate Roadmap</>
              )}
            </Button>
          </motion.div>
        </>
      )}

      <AnimatePresence>
        {roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <button
              onClick={() => { setRoadmap(null); setCompletedSteps(new Set()); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Roadmaps
            </button>

            <div className="gradient-primary rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 dot-pattern opacity-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4 text-teal-200" />
                  <span className="text-teal-200 text-sm font-medium">Your Roadmap</span>
                </div>
                <h2 className="font-display text-2xl font-semibold mb-2">{roadmap.targetRole}</h2>
                <p className="text-teal-100 text-sm leading-relaxed max-w-2xl">{roadmap.overview}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-teal-200">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {tfLabel(roadmap.timeframe)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {completedSteps.size}/{roadmap.steps.length} phases done
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {roadmap.steps.map((step, i) => {
                const done = completedSteps.has(i);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`bg-white/90 border rounded-2xl p-5 shadow-sm transition-all ${
                      done ? "border-teal-200 bg-teal-50/30" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button onClick={() => toggleStep(i)} className="mt-0.5 flex-shrink-0">
                        {done
                          ? <CheckCircle2 className="w-6 h-6 text-teal-500" />
                          : <Circle className="w-6 h-6 text-slate-300 hover:text-teal-400 transition-colors" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 rounded-lg px-2 py-0.5">
                            PHASE {i + 1}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{step.duration}
                          </span>
                        </div>
                        <h3 className={`font-display font-semibold text-lg mb-1.5 ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Tasks</p>
                            <ul className="space-y-1.5">
                              {step.tasks.map((task, j) => (
                                <li key={j} className="flex gap-2 text-xs text-muted-foreground">
                                  <ChevronRight className="w-3 h-3 text-teal-400 mt-0.5 flex-shrink-0" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Resources</p>
                            <ul className="space-y-1.5">
                              {step.resources.map((res, j) => (
                                <li key={j} className="flex gap-2 text-xs text-muted-foreground">
                                  <BookOpen className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                                  {res}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}