import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    let resumeText = "";
    try {
      const { extractText } = await import("unpdf");
      const { text } = await extractText(new Uint8Array(arrayBuffer), {
        mergePages: true,
      });
      resumeText = text;
      console.log("PDF parsed, text length:", resumeText.length);
    } catch (parseErr) {
      console.error("PDF parse error:", parseErr);
      return NextResponse.json(
        { error: "Failed to parse PDF. Make sure it's a valid text-based PDF." },
        { status: 400 }
      );
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "No text found in PDF. Make sure it's not a scanned image." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed feedback.

RESUME TEXT:
${resumeText.slice(0, 8000)}

Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>"],
  "keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "atsNotes": "<2-3 sentences about ATS compatibility and formatting>"
}`;

    const raw = await generateText(prompt);

    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        return NextResponse.json(
          { error: "AI response parsing failed. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Resume API error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}