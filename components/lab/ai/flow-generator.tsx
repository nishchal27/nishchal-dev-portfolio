"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface, Message } from "./chat-interface";
import { FlowDiagram } from "@/components/lab/flows/flow-diagram";
import { LoadingState, ErrorState, RateLimitState } from "./loading-states";
import type { FlowStep } from "@/data/flows";

interface AIFlowData {
  feature: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    component?: string;
    edgeCases?: string[];
    failureHandling?: string;
    retryLogic?: string;
  }>;
  overview?: string;
  failurePoints?: string[];
  optimizationTips?: string[];
}

interface FlowGeneratorProps {
  initialProvider?: "openai" | "anthropic";
  availableProviders?: ("openai" | "anthropic")[];
}

export function FlowGenerator({
  initialProvider = "openai",
  availableProviders = ["openai", "anthropic"],
}: FlowGeneratorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"openai" | "anthropic">(initialProvider);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flowData, setFlowData] = useState<AIFlowData | null>(null);
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
        const response = await fetch("/api/ai/flows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            featureName: message,
            sessionId,
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
          throw new Error(data.message || data.error || "Failed to generate flow");
        }

        // Update session ID
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        // Add assistant message
        const assistantMessage: Message = {
          role: "assistant",
          content: data.data.overview || `Flow generated for: ${message}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update flow data
        if (data.data.steps) {
          setFlowData(data.data as AIFlowData);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Flow generation error:", err);
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

  // Convert AI flow data to FlowStep format
  const flowSteps: FlowStep[] = flowData?.steps.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    component: step.component,
    edgeCases: step.edgeCases,
    failureHandling: step.failureHandling || step.retryLogic,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flow Generator</CardTitle>
          <CardDescription>
            Describe a feature you want to implement. The AI will generate a
            detailed step-by-step flow with failure points, edge cases, retry
            logic, and optimization tips.
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
            placeholder="Enter feature name, e.g., 'user signup', 'payment processing', 'AI request handling'"
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

      {/* Flow Diagram */}
      {flowData && flowSteps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{flowData.feature}</CardTitle>
              {flowData.overview && (
                <CardDescription>{flowData.overview}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <FlowDiagram steps={flowSteps} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Additional Information */}
      {flowData && (
        <div className="grid gap-4 sm:grid-cols-2">
          {flowData.failurePoints && flowData.failurePoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Critical Failure Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {flowData.failurePoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-text-secondary flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {flowData.optimizationTips && flowData.optimizationTips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {flowData.optimizationTips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-text-secondary flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
