"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type AnalysisResult = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  atsNotes: string;
};

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scoreColor =
    !result
      ? ""
      : result.score >= 80
      ? "text-teal-600"
      : result.score >= 60
      ? "text-amber-600"
      : "text-red-500";

  const scoreLabel =
    !result
      ? ""
      : result.score >= 80
      ? "Excellent"
      : result.score >= 60
      ? "Good"
      : "Needs Work";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Resume Analyzer
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload your resume for AI-powered feedback, ATS scoring, and
          improvement tips.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer",
          file
            ? "border-teal-300 bg-teal-50/50 cursor-default"
            : isDragging
            ? "border-teal-400 bg-teal-50"
            : "border-slate-200 bg-white/70 hover:border-teal-300 hover:bg-teal-50/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="p-10 text-center">
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(file.size / 1024).toFixed(0)} KB · PDF
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setResult(null);
                }}
                className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 mt-1 transition-colors"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Drop your resume here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse · PDF only · Max 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {file && !result && (
        <Button
          onClick={analyze}
          disabled={isAnalyzing}
          className="gradient-primary text-white border-0 hover:opacity-90 w-full h-11 text-base font-medium rounded-xl shadow-md shadow-teal-200/40"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing your resume...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Analyze Resume
            </>
          )}
        </Button>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Score card */}
            <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
              <div className="text-center flex-shrink-0">
                <div className={`font-display text-5xl font-semibold ${scoreColor}`}>
                  {result.score}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">out of 100</div>
                <div className={`text-sm font-semibold mt-1 ${scoreColor}`}>
                  {scoreLabel}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 text-sm font-medium">
                  <span>ATS Score</span>
                  <span className={scoreColor}>{result.score}%</span>
                </div>
                <Progress
                  value={result.score}
                  className="h-2.5 bg-slate-100"
                />
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Strengths
                  </h3>
                </div>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-teal-500 font-bold mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Improvements
                  </h3>
                </div>
                <ul className="space-y-2">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-400 font-bold mt-0.5">→</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keywords & ATS Notes */}
            <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-sm text-foreground">
                  Keywords Found
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {result.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-blue-50 text-blue-700 border border-blue-100 rounded-lg px-2.5 py-1 text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">ATS Notes: </span>
                {result.atsNotes}
              </div>
            </div>

            <Button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              variant="outline"
              className="w-full rounded-xl border-slate-200"
            >
              Analyze Another Resume
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
