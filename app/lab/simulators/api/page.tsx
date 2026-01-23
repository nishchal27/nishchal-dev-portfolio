"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CostSimulator } from "@/components/lab/simulators/cost-simulator";

function calculateAPICost(values: Record<string, number>) {
  const { apiCallsPerDay, avgResponseSize, cacheHitRatio } = values;

  // Assumptions
  const computeCostPerMillion = 2.0; // $2 per million API calls
  const dbCostPerGB = 0.10; // $0.10/GB for database
  const cacheCostPerGB = 0.02; // $0.02/GB for cache

  // Calculations
  const apiCallsPerMonth = apiCallsPerDay * 30;
  const cacheHits = apiCallsPerMonth * (cacheHitRatio / 100);
  const cacheMisses = apiCallsPerMonth - cacheHits;

  // Compute costs (only for cache misses that hit the API)
  const computeCost = (cacheMisses / 1000000) * computeCostPerMillion;

  // Database costs (queries + storage)
  const dbQueries = cacheMisses;
  const dbQueryCost = (dbQueries / 1000000) * 0.5; // $0.5 per million queries
  const dbStorageGB = (apiCallsPerMonth * avgResponseSize) / (1024 * 1024 * 1024) * 0.1; // 10% of data stored
  const dbStorageCost = dbStorageGB * dbCostPerGB;
  const totalDbCost = dbQueryCost + dbStorageCost;

  // Cache costs
  const cacheStorageGB = 5; // Assume 5GB cache
  const cacheStorageCost = cacheStorageGB * cacheCostPerGB;
  const cacheOpsCost = cacheHits * 0.0000005; // $0.0000005 per cache hit
  const totalCacheCost = cacheStorageCost + cacheOpsCost;

  // Savings from caching
  const costWithoutCache = (apiCallsPerMonth / 1000000) * computeCostPerMillion + totalDbCost;
  const savings = costWithoutCache - (computeCost + totalDbCost + totalCacheCost);

  const total = computeCost + totalDbCost + totalCacheCost;

  const breakdown = [
    {
      component: "Compute (API Processing)",
      cost: computeCost,
      percentage: (computeCost / total) * 100,
    },
    {
      component: "Database",
      cost: totalDbCost,
      percentage: (totalDbCost / total) * 100,
    },
    {
      component: "Cache",
      cost: totalCacheCost,
      percentage: (totalCacheCost / total) * 100,
    },
  ];

  // Chart data
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const multiplier = (i + 1) * 0.2;
    const scaledCalls = apiCallsPerDay * multiplier * 30;
    const scaledMisses = scaledCalls * (1 - cacheHitRatio / 100);
    const scaledCompute = (scaledMisses / 1000000) * computeCostPerMillion;
    const scaledDb = (scaledMisses / 1000000) * 0.5 + (scaledCalls * avgResponseSize) / (1024 * 1024 * 1024) * 0.1 * dbCostPerGB;
    return {
      label: `${(multiplier * 100).toFixed(0)}%`,
      cost: scaledCompute + scaledDb + totalCacheCost,
    };
  });

  return { total, breakdown, chartData, savings };
}

export default function APISimulatorPage() {
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
            title="API Usage Simulator"
            description="Calculate compute costs, database load, and caching benefits based on API usage patterns and response sizes."
            inputs={[
              {
                key: "apiCallsPerDay",
                label: "API Calls per Day",
                initialValue: 100000,
                min: 10000,
                max: 10000000,
                step: 10000,
                unit: "calls",
              },
              {
                key: "avgResponseSize",
                label: "Average Response Size",
                initialValue: 10,
                min: 1,
                max: 100,
                step: 1,
                unit: "KB",
              },
              {
                key: "cacheHitRatio",
                label: "Cache Hit Ratio",
                initialValue: 70,
                min: 0,
                max: 99,
                step: 1,
                unit: "%",
              },
            ]}
            calculate={calculateAPICost}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
