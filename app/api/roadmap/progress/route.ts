import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  roadmapId: z.string(),
  completedSteps: z.array(z.number()),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { roadmapId, completedSteps } = schema.parse(body);

    await db.roadmap.update({
      where: { id: roadmapId },
      data: { completedSteps, updatedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}