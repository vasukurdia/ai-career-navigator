import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function getGeminiModel(modelName = 'gemini-3-flash-preview') {
  return genAI.getGenerativeModel({ model: modelName });
}

export async function generateText(prompt: string): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateChat(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const model = getGeminiModel();

  const systemPrompt = `You are an expert AI Career Advisor. You help professionals with:
- Career planning and transitions
- Job search strategies and interview preparation
- Skill development recommendations
- Resume and LinkedIn optimization
- Salary negotiation tactics
- Industry insights and trends

Be specific, actionable, and encouraging. Use bullet points when listing items. Keep responses focused and helpful.`;

  // Build history for Gemini (all but the last message)
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: "System: " + systemPrompt }] },
      { role: "model", parts: [{ text: "Understood! I'm ready to be your career advisor." }] },
      ...history,
    ],
  });

  const lastMsg = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMsg.content);
  return result.response.text();
}
