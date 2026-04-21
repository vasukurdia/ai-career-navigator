"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { User, Briefcase, Target, Code, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const EXPERIENCE_LEVELS = [
  { value: "student", label: "Student / Fresher" },
  { value: "0-1", label: "0–1 Years" },
  { value: "1-3", label: "1–3 Years" },
  { value: "3-5", label: "3–5 Years" },
  { value: "5-10", label: "5–10 Years" },
  { value: "10+", label: "10+ Years" },
];

const COMMON_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "TypeScript",
  "SQL", "Java", "C++", "Machine Learning", "Data Analysis",
  "Product Management", "UX Design", "DevOps", "AWS", "Docker",
  "Git", "Figma", "Agile/Scrum", "Communication", "Leadership",
];

export default function ProfilePage() {
  const { user } = useUser();
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile/update")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setCurrentRole(data.profile.currentRole || "");
          setTargetRole(data.profile.targetRole || "");
          setExperience(data.profile.experience || "");
          setSelectedSkills(data.profile.skills || []);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentRole, targetRole, experience, skills: selectedSkills }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl shimmer-bg" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Keep this updated for better AI recommendations.</p>
      </div>

      {/* Clerk user info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center gap-4">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="avatar" className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
          ) : (
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white text-lg font-semibold">
              {user?.firstName?.[0] || "U"}
            </div>
          )}
          <div>
            <div className="font-semibold text-foreground">{user?.fullName || "Your Name"}</div>
            <div className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</div>
            <div className="text-xs text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-2.5 py-0.5 mt-1.5 inline-block font-medium">
              Free Plan
            </div>
          </div>
        </div>
      </motion.div>

      {/* Career info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-4 h-4 text-teal-600" />
          <h2 className="font-semibold text-foreground">Career Details</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Current Role</Label>
            <Input
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g. Junior Developer"
              className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-teal-400/30"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-teal-500" /> Target Role
            </Label>
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Product Manager"
              className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-teal-400/30"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Years of Experience</Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 w-full sm:w-56">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-4 h-4 text-teal-600" />
          <h2 className="font-semibold text-foreground">Your Skills</h2>
          {selectedSkills.length > 0 && (
            <span className="ml-auto text-xs text-teal-600 font-medium bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5">
              {selectedSkills.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map((skill) => {
            const selected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-sm rounded-xl px-3 py-1.5 border font-medium transition-all ${
                  selected
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </motion.div>

      <Button
        onClick={save}
        disabled={isSaving}
        className="w-full gradient-primary text-white border-0 hover:opacity-90 h-11 font-medium rounded-xl shadow-md shadow-teal-200/40"
      >
        {isSaving ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
        ) : saved ? (
          <><CheckCircle2 className="w-4 h-4 mr-2" />Saved!</>
        ) : (
          <><Save className="w-4 h-4 mr-2" />Save Profile</>
        )}
      </Button>
    </div>
  );
}