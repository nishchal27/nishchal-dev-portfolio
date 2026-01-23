"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  provider?: "openai" | "anthropic";
  onProviderChange?: (provider: "openai" | "anthropic") => void;
  availableProviders?: ("openai" | "anthropic")[];
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  error,
  onRetry,
  provider = "openai",
  onProviderChange,
  availableProviders = ["openai", "anthropic"],
  placeholder = "Type your message...",
  disabled = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || disabled) return;

    const message = input.trim();
    setInput("");
    setIsSending(true);

    try {
      await onSendMessage(message);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Provider selector */}
      {onProviderChange && availableProviders.length > 1 && (
        <div className="mb-4 flex gap-2">
          {availableProviders.map((p) => (
            <button
              key={p}
              onClick={() => onProviderChange(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                provider === p
                  ? "bg-accent/10 border-accent text-accent"
                  : "border-border text-text-secondary hover:border-accent/50"
              }`}
            >
              {p === "openai" ? "OpenAI" : "Anthropic"}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-text-secondary py-12"
            >
              <p>Start a conversation to get AI-powered engineering insights.</p>
            </motion.div>
          )}

          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-accent/10 text-accent"
                    : "bg-surface border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-surface border border-border rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  <span className="text-sm text-text-secondary">
                    Thinking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="border-red-500/50 bg-red-500/5 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-500">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="text-xs text-red-400 hover:text-red-300 mt-1 underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={placeholder}
          disabled={disabled || isSending || isLoading}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isSending || isLoading || disabled}
          className="px-4"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
