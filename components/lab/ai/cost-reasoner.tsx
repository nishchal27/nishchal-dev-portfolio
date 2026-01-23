"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface, Message } from "./chat-interface";
import { LoadingState, ErrorState, RateLimitState } from "./loading-states";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AICostData {
  costBreakdown: {
    components: Array<{
      component: string;
      estimatedCost: string;
      costDrivers: string[];
      optimizationLevers: string[];
    }>;
    totalEstimatedCost: string;
    costGrowthCurve: string;
  };
  optimizationOpportunities: Array<{
    area: string;
    potentialSavings: string;
    implementationComplexity: string;
    description: string;
  }>;
  breakpoints: Array<{
    trafficLevel: string;
    description: string;
    recommendation: string;
  }>;
  reasoning: string;
}

interface CostReasonerProps {
  initialProvider?: "openai" | "anthropic";
  availableProviders?: ("openai" | "anthropic")[];
}

export function CostReasoner({
  initialProvider = "openai",
  availableProviders = ["openai", "anthropic"],
}: CostReasonerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"openai" | "anthropic">(initialProvider);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [costData, setCostData] = useState<AICostData | null>(null);
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
        const response = await fetch("/api/ai/cost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trafficEstimate: message,
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
          throw new Error(data.message || data.error || "Failed to analyze costs");
        }

        // Update session ID
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        // Add assistant message
        const assistantMessage: Message = {
          role: "assistant",
          content: data.data.reasoning || "Cost analysis completed.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update cost data
        if (data.data.costBreakdown) {
          setCostData(data.data as AICostData);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Cost reasoning error:", err);
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

  // Prepare chart data
  const chartData = costData?.costBreakdown.components.map((comp) => ({
    name: comp.component,
    cost: parseFloat(comp.estimatedCost.replace(/[^0-9.]/g, "")) || 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cost & Performance Reasoner</CardTitle>
          <CardDescription>
            Provide traffic estimates and AI usage patterns. The AI will analyze
            cost implications, identify optimization opportunities, and highlight
            architecture breakpoints.
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
            placeholder="Describe traffic and usage, e.g., '1M requests/day, 10% use AI features, PostgreSQL database, Redis cache'"
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

      {/* Cost Breakdown */}
      {costData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Cost Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                {costData.costBreakdown.costGrowthCurve}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-accent">
                  {costData.costBreakdown.totalEstimatedCost}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Estimated total cost
                </p>
              </div>

              {chartData.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="cost" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {costData.costBreakdown.components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-border bg-surface"
                  >
                    <h4 className="font-semibold mb-2">{comp.component}</h4>
                    <p className="text-sm text-accent mb-2">
                      {comp.estimatedCost}
                    </p>
                    {comp.costDrivers && comp.costDrivers.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-text-secondary mb-1">
                          Cost Drivers:
                        </p>
                        <ul className="text-xs text-text-secondary space-y-0.5">
                          {comp.costDrivers.map((driver, i) => (
                            <li key={i}>• {driver}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {comp.optimizationLevers &&
                      comp.optimizationLevers.length > 0 && (
                        <div>
                          <p className="text-xs text-text-secondary mb-1">
                            Optimization:
                          </p>
                          <ul className="text-xs text-accent space-y-0.5">
                            {comp.optimizationLevers.map((lever, i) => (
                              <li key={i}>• {lever}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Opportunities */}
          {costData.optimizationOpportunities &&
            costData.optimizationOpportunities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {costData.optimizationOpportunities.map((opp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-border bg-surface"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{opp.area}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              opp.implementationComplexity === "low"
                                ? "bg-green-500/20 text-green-500"
                                : opp.implementationComplexity === "medium"
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {opp.implementationComplexity}
                          </span>
                        </div>
                        <p className="text-sm text-accent mb-2">
                          {opp.potentialSavings}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {opp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Breakpoints */}
          {costData.breakpoints && costData.breakpoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Architecture Breakpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costData.breakpoints.map((bp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-border bg-surface"
                    >
                      <h4 className="font-semibold mb-2">{bp.trafficLevel}</h4>
                      <p className="text-sm text-text-secondary mb-2">
                        {bp.description}
                      </p>
                      <p className="text-sm text-accent">{bp.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
