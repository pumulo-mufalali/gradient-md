"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  initialContext?: string;
}

export function ChatInterface({ initialContext }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          context: initialContext,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your question. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card flex h-[420px] flex-col overflow-hidden">
      <div className="border-b border-[var(--color-card-border)] px-4 py-3">
        <h3 className="text-sm font-semibold">Ask a Follow-Up Question</h3>
        <p className="text-xs text-[var(--color-muted)]">
          Get more details about your triage results with cited answers
        </p>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Ask any follow-up question about your symptoms or triage
                results.
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {[
                  "What should I watch for?",
                  "When should I go to the ER?",
                  "Are there home remedies?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="rounded-full border border-[var(--color-card-border)] px-3 py-1 text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-bg)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3.5 py-2 text-sm leading-relaxed ${
                msg.role === "user" ? "chat-user" : "chat-assistant"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-assistant flex items-center gap-1 px-3.5 py-2.5">
              <div className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
              <div className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
              <div className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[var(--color-card-border)] p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3.5 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="btn-primary flex h-9 w-9 shrink-0 items-center justify-center !p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
