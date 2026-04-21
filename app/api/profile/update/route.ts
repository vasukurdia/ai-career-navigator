import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  currentRole: z.string().optional(),
  targetRole: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ profile: null });

    return NextResponse.json({ profile: user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = schema.parse(body);

    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {
        currentRole: data.currentRole,
        targetRole: data.targetRole,
        experience: data.experience,
        skills: data.skills || [],
        updatedAt: new Date(),
      },
      create: {
        clerkId: userId,
        email: "",
        currentRole: data.currentRole,
        targetRole: data.targetRole,
        experience: data.experience,
        skills: data.skills || [],
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}