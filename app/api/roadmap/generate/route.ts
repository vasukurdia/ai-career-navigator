import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "@/lib/gemini";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  currentRole: z.string().optional(),
  targetRole: z.string().min(1),
  timeframe: z.string(),
});

const TIMEFRAME_LABELS: Record<string, string> = {
  "3months": "3 months",
  "6months": "6 months",
  "1year": "1 year",
  "2years": "2 years",
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { currentRole, targetRole, timeframe } = schema.parse(body);
    const tfLabel = TIMEFRAME_LABELS[timeframe] || timeframe;

    const prompt = `You are an expert career coach. Create a detailed career roadmap for someone who wants to become a ${targetRole} in ${tfLabel}.
${currentRole ? `They are currently working as: ${currentRole}` : ""}

Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "targetRole": "${targetRole}",
  "timeframe": "${timeframe}",
  "overview": "<2-3 sentences describing the journey>",
  "steps": [
    {
      "phase": "Phase 1",
      "duration": "<e.g. Weeks 1-4>",
      "title": "<phase title>",
      "description": "<2 sentences about this phase>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"],
      "resources": ["<resource 1>", "<resource 2>", "<resource 3>"]
    }
  ]
}

Create 4-6 phases. Make tasks specific and actionable. Include real courses, books, or platforms as resources.`;

    const raw = await generateText(prompt);
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else throw new Error("Failed to parse AI response");
    }

    // DB mein save karo
    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email: "" },
    });

    await db.roadmap.create({
      data: {
        userId: user.id,
        title: `${targetRole} Roadmap`,
        targetRole,
        timeframe,
        steps: result.steps,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Roadmap API error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}