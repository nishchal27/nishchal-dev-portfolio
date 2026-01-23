"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CostSimulator } from "@/components/lab/simulators/cost-simulator";

function calculateAITokenCost(values: Record<string, number>) {
  const { tokensPerRequest, requestsPerDay, optimizationRatio } = values;

  // Assumptions (OpenAI GPT-4 pricing)
  const inputCostPer1K = 0.03; // $0.03 per 1K input tokens
  const outputCostPer1K = 0.06; // $0.06 per 1K output tokens
  const inputRatio = 0.6; // 60% input, 40% output

  // Calculations
  const inputTokens = tokensPerRequest * inputRatio;
  const outputTokens = tokensPerRequest * (1 - inputRatio);
  const costPerRequest =
    (inputTokens / 1000) * inputCostPer1K + (outputTokens / 1000) * outputCostPer1K;

  // Apply optimization (reduces tokens needed)
  const optimizedCostPerRequest = costPerRequest * (1 - optimizationRatio / 100);

  const requestsPerMonth = requestsPerDay * 30;
  const totalCost = optimizedCostPerRequest * requestsPerMonth;
  const costWithoutOptimization = costPerRequest * requestsPerMonth;
  const savings = costWithoutOptimization - totalCost;

  const breakdown = [
    {
      component: "Input Tokens",
      cost: (inputTokens / 1000) * inputCostPer1K * requestsPerMonth * (1 - optimizationRatio / 100),
      percentage: 60,
    },
    {
      component: "Output Tokens",
      cost: (outputTokens / 1000) * outputCostPer1K * requestsPerMonth * (1 - optimizationRatio / 100),
      percentage: 40,
    },
  ];

  // Chart data
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const multiplier = (i + 1) * 0.2;
    const scaledRequests = requestsPerDay * multiplier * 30;
    const scaledCost = optimizedCostPerRequest * scaledRequests;
    return {
      label: `${(multiplier * 100).toFixed(0)}%`,
      cost: scaledCost,
    };
  });

  return { total: totalCost, breakdown, chartData, savings };
}

export default function AITokenSimulatorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <Link
            href="/lab/simulators"
            className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Simulators
          </Link>

          <CostSimulator
            title="AI Token Cost Simulator"
            description="Estimate AI token costs, monthly expenses, and optimization impact for LLM-powered applications. Based on OpenAI GPT-4 pricing."
            inputs={[
              {
                key: "tokensPerRequest",
                label: "Tokens per Request",
                initialValue: 2000,
                min: 100,
                max: 100000,
                step: 100,
                unit: "tokens",
              },
              {
                key: "requestsPerDay",
                label: "Requests per Day",
                initialValue: 1000,
                min: 100,
                max: 100000,
                step: 100,
                unit: "requests",
              },
              {
                key: "optimizationRatio",
                label: "Optimization (Token Reduction)",
                initialValue: 20,
                min: 0,
                max: 50,
                step: 1,
                unit: "%",
              },
            ]}
            calculate={calculateAITokenCost}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
