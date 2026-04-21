import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateChat } from "@/lib/gemini";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string().nullable().optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { messages, sessionId } = schema.parse(body);

    // User upsert
    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email: "" },
    });

    // Session find ya create
    let session;
    if (sessionId) {
      session = await db.chatSession.findUnique({ where: { id: sessionId } });
    }
    if (!session) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      const title = firstUserMsg ? firstUserMsg.content.slice(0, 50) : "New Conversation";
      session = await db.chatSession.create({
        data: { userId: user.id, title },
      });
    }

    // Last user message save karo
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "user") {
      await db.message.create({
        data: { sessionId: session.id, role: "user", content: lastMsg.content },
      });
    }

    // Gemini response
    const content = await generateChat(messages);

    // Assistant message save karo
    await db.message.create({
      data: { sessionId: session.id, role: "assistant", content },
    });

    // Session updatedAt touch karo
    await db.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ content, sessionId: session.id });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}