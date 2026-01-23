"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiagramViewer } from "@/components/lab/architecture/diagram-viewer";
import { LoadingState, ErrorState, RateLimitState } from "./loading-states";
import { convertAIArchitectureToFlow } from "@/lib/ai/diagram-utils";
import type { AIArchitectureData } from "@/lib/ai/diagram-utils";
import { debounce } from "@/lib/rate-limit";

interface AISystemDesignData {
  updatedArchitecture: {
    components: Array<{
      id: string;
      name: string;
      type: string;
      description: string;
      technologies?: string[];
    }>;
    connections: Array<{
      from: string;
      to: string;
      type?: string;
    }>;
  };
  impact: {
    cost: {
      change: string;
      reasoning: string;
      estimate: string;
    };
    performance: {
      change: string;
      reasoning: string;
      metrics?: string[];
    };
    complexity: {
      change: string;
      reasoning: string;
    };
  };
  tradeoffs: string[];
  recommendation: string;
}

interface SystemDesignerProps {
  initialProvider?: "openai" | "anthropic";
  availableProviders?: ("openai" | "anthropic")[];
}

export function SystemDesigner({
  initialProvider = "openai",
  availableProviders = ["openai", "anthropic"],
}: SystemDesignerProps) {
  const [baseArchitecture, setBaseArchitecture] = useState("");
  const [changes, setChanges] = useState({
    database: "",
    cache: false,
    queue: false,
    cdn: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"openai" | "anthropic">(initialProvider);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [designData, setDesignData] = useState<AISystemDesignData | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    retryAfter?: number;
    remaining?: { hourly: number; daily: number };
  } | null>(null);

  // Debounced analysis function
  const debouncedAnalyze = useCallback(
    debounce(async (arch: string, chgs: typeof changes) => {
      if (!arch.trim()) return;

      setIsLoading(true);
      setError(null);
      setRateLimitInfo(null);

      try {
        const response = await fetch("/api/ai/system-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baseArchitecture: arch,
            changes: chgs,
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
          throw new Error(data.message || data.error || "Failed to analyze design");
        }

        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        if (data.data.updatedArchitecture) {
          setDesignData(data.data as AISystemDesignData);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("System design analysis error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [sessionId, provider]
  );

  // Trigger analysis when base architecture or changes update
  useEffect(() => {
    if (baseArchitecture.trim()) {
      debouncedAnalyze(baseArchitecture, changes);
    }
  }, [baseArchitecture, changes, debouncedAnalyze]);

  const handleChange = (key: keyof typeof changes, value: string | boolean) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
  };

  const { nodes, edges, components } = designData
    ? convertAIArchitectureToFlow({
        architecture: designData.updatedArchitecture,
      } as AIArchitectureData)
    : { nodes: [], edges: [], components: [] };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive System Designer</CardTitle>
          <CardDescription>
            Describe your base architecture, then toggle infrastructure choices
            to see real-time AI analysis of cost, performance, and complexity
            implications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Architecture Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Base Architecture
            </label>
            <textarea
              value={baseArchitecture}
              onChange={(e) => setBaseArchitecture(e.target.value)}
              placeholder="Describe your base architecture, e.g., 'Next.js frontend, PostgreSQL database, REST API'"
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Infrastructure Toggles */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Infrastructure Choices
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-text-secondary mb-2">
                  Database
                </label>
                <select
                  value={changes.database}
                  onChange={(e) => handleChange("database", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="">No change</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="Redis">Redis</option>
                  <option value="DynamoDB">DynamoDB</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changes.cache}
                    onChange={(e) => handleChange("cache", e.target.checked)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm">Enable Cache (Redis)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changes.queue}
                    onChange={(e) => handleChange("queue", e.target.checked)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm">Enable Queue (BullMQ/SQS)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changes.cdn}
                    onChange={(e) => handleChange("cdn", e.target.checked)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm">Enable CDN</span>
                </label>
              </div>
            </div>
          </div>

          {/* Provider Selection */}
          {availableProviders.length > 1 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                AI Provider
              </label>
              <div className="flex gap-2">
                {availableProviders.map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Limit Warning */}
      {rateLimitInfo && (
        <RateLimitState
          retryAfter={rateLimitInfo.retryAfter}
          remaining={rateLimitInfo.remaining}
        />
      )}

      {/* Loading State */}
      {isLoading && <LoadingState message="Analyzing architecture changes..." />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState message={error} onRetry={() => debouncedAnalyze(baseArchitecture, changes)} />
      )}

      {/* Design Analysis Results */}
      {designData && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Updated Architecture Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Updated Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <DiagramViewer nodes={nodes} edges={edges} components={components} />
            </CardContent>
          </Card>

          {/* Impact Analysis */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-lg font-semibold mb-2 ${
                    designData.impact.cost.change === "increase"
                      ? "text-red-500"
                      : designData.impact.cost.change === "decrease"
                      ? "text-green-500"
                      : "text-text-secondary"
                  }`}
                >
                  {designData.impact.cost.change.toUpperCase()}
                </p>
                <p className="text-sm text-text-secondary mb-2">
                  {designData.impact.cost.estimate}
                </p>
                <p className="text-xs text-text-secondary">
                  {designData.impact.cost.reasoning}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-lg font-semibold mb-2 ${
                    designData.impact.performance.change === "improvement"
                      ? "text-green-500"
                      : designData.impact.performance.change === "degradation"
                      ? "text-red-500"
                      : "text-text-secondary"
                  }`}
                >
                  {designData.impact.performance.change.toUpperCase()}
                </p>
                <p className="text-sm text-text-secondary mb-2">
                  {designData.impact.performance.reasoning}
                </p>
                {designData.impact.performance.metrics && (
                  <ul className="text-xs text-text-secondary space-y-1">
                    {designData.impact.performance.metrics.map((metric, idx) => (
                      <li key={idx}>• {metric}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complexity Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-lg font-semibold mb-2 ${
                    designData.impact.complexity.change === "increase"
                      ? "text-red-500"
                      : designData.impact.complexity.change === "decrease"
                      ? "text-green-500"
                      : "text-text-secondary"
                  }`}
                >
                  {designData.impact.complexity.change.toUpperCase()}
                </p>
                <p className="text-xs text-text-secondary">
                  {designData.impact.complexity.reasoning}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tradeoffs and Recommendation */}
          <div className="grid gap-4 sm:grid-cols-2">
            {designData.tradeoffs && designData.tradeoffs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tradeoffs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {designData.tradeoffs.map((tradeoff, idx) => (
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {designData.recommendation}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
