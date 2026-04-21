export type UserProfile = {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  currentRole?: string;
  targetRole?: string;
  experience?: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type ResumeAnalysis = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  atsNotes: string;
};

export type RoadmapStep = {
  phase: string;
  duration: string;
  title: string;
  description: string;
  tasks: string[];
  resources: string[];
};

export type RoadmapData = {
  targetRole: string;
  timeframe: string;
  overview: string;
  steps: RoadmapStep[];
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};
