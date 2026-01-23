"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInterface, Message } from "./chat-interface";
import { DiagramViewer } from "@/components/lab/architecture/diagram-viewer";
import { LoadingState, ErrorState, RateLimitState } from "./loading-states";
import { convertAIArchitectureToFlow } from "@/lib/ai/diagram-utils";
import type { AIArchitectureData } from "@/lib/ai/diagram-utils";

interface ArchitecturePlannerProps {
  initialProvider?: "openai" | "anthropic";
  availableProviders?: ("openai" | "anthropic")[];
}

export function ArchitecturePlanner({
  initialProvider = "openai",
  availableProviders = ["openai", "anthropic"],
}: ArchitecturePlannerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"openai" | "anthropic">(initialProvider);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [architectureData, setArchitectureData] = useState<AIArchitectureData | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    retryAfter?: number;
    remaining?: { hourly: number; daily: number };
  } | null>(null);

  const handleSendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setError(null);
      setRateLimitInfo(null);

      // Add user message to UI
      const userMessage: Message = {
        role: "user",
        content: message,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch("/api/ai/architecture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appIdea: message,
            ...(sessionId && { sessionId }),
            provider,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            setRateLimitInfo({
              remaining: data.remaining,
            });
            throw new Error(data.message || "Rate limit exceeded");
          }
          // Show detailed validation errors
          const errorMessage = data.message || data.error || "Failed to generate architecture";
          const details = data.details 
            ? `\n\nDetails: ${JSON.stringify(data.details, null, 2)}`
            : "";
          throw new Error(errorMessage + details);
        }

        // Update session ID
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        // Add assistant message
        const assistantMessage: Message = {
          role: "assistant",
          content: data.data.explanation || "Architecture generated successfully.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update architecture data
        if (data.data.architecture) {
          setArchitectureData(data.data as AIArchitectureData);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Architecture planning error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, provider]
  );

  const handleRetry = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages]
        .reverse()
        .find((m) => m.role === "user");
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content);
      }
    }
  }, [messages, handleSendMessage]);

  const { nodes, edges, components } = architectureData
    ? convertAIArchitectureToFlow(architectureData)
    : { nodes: [], edges: [], components: [] };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>AI Architecture Planner</CardTitle>
          <CardDescription>
            Describe your app idea and constraints. The AI will generate a
            production-ready system architecture with components, connections,
            tradeoffs, and scaling considerations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            provider={provider}
            onProviderChange={setProvider}
            availableProviders={availableProviders}
            placeholder="Describe your app idea, e.g., 'A social media platform for developers with real-time chat, image uploads, and AI-powered content recommendations'"
          />
        </CardContent>
      </Card>

      {/* Rate Limit Warning */}
      {rateLimitInfo && (
        <RateLimitState
          retryAfter={rateLimitInfo.retryAfter}
          remaining={rateLimitInfo.remaining}
        />
      )}

      {/* Architecture Diagram */}
      {architectureData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>
                {architectureData.explanation || "Generated architecture diagram"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiagramViewer
                nodes={nodes}
                edges={edges}
                components={components}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Additional Information */}
      {architectureData && (
        <div className="grid gap-4 sm:grid-cols-2">
          {architectureData.tradeoffs && architectureData.tradeoffs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Tradeoffs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {architectureData.tradeoffs.map((tradeoff, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-text-secondary flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {architectureData.risks && architectureData.risks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {architectureData.risks.map((risk, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-text-secondary flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {architectureData.scalingConsiderations && (
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Scaling Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {architectureData.scalingConsiderations}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
