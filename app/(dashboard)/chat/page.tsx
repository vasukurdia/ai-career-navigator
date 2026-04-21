"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Sparkles, RotateCcw, Copy, Check, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm your AI Career Advisor powered by Gemini. Ask me anything about careers, skills, interviews, or job search.\n\nWhat's on your mind?",
  timestamp: new Date(),
};

const SUGGESTED_PROMPTS = [
  "How do I transition from software engineer to product manager?",
  "What skills should I learn to become a data scientist?",
  "How do I negotiate a higher salary?",
  "Help me prepare for a technical interview",
  "What are the top in-demand tech skills right now?",
  "How do I write a cold email to a recruiter?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Page load pe last session load karo
  useEffect(() => {
    fetch("/api/chat/sessions")
      .then((r) => r.json())
      .then((data) => {
        const sessions = data.sessions || [];
        if (sessions.length > 0) loadSession(sessions[0].id);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSession = async (id: string) => {
    const res = await fetch(`/api/chat/session?id=${id}`);
    const data = await res.json();
    if (data.messages?.length > 0) {
      setSessionId(id);
      setMessages(
        data.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.createdAt),
        }))
      );
    }
  };

  const clearChat = () => {
    setSessionId(null);
    setMessages([WELCOME_MSG]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const allMsgs = [...messages.filter((m) => m.id !== "welcome"), userMsg];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: allMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      if (data.sessionId && !sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">AI Career Advisor</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Powered by Gemini AI</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          className="gap-1.5 text-muted-foreground hover:text-foreground rounded-xl border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1 pb-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                msg.role === "user"
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-slate-200 text-teal-600 shadow-sm"
              )}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={cn(
                "group max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative",
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-tr-sm"
                  : "bg-white/90 border border-slate-200 text-foreground rounded-tl-sm shadow-sm"
              )}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:font-semibold prose-strong:font-semibold prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded prose-code:text-xs prose-code:text-teal-700">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-100"
                  >
                    {copiedId === msg.id
                      ? <Check className="w-3 h-3 text-teal-600" />
                      : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
              <div className="bg-white/90 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && (
        <div className="py-3">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs bg-white/80 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex gap-2.5 bg-white/80 border border-slate-200 rounded-2xl p-2 shadow-sm focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about careers, skills, interviews, salary..."
            className="flex-1 min-h-[44px] max-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 text-sm p-2 placeholder:text-slate-400"
            rows={1}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="w-9 h-9 gradient-primary text-white border-0 rounded-xl flex-shrink-0 self-end hover:opacity-90 disabled:opacity-40 shadow-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}