"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CostSimulator } from "@/components/lab/simulators/cost-simulator";

function calculateTrafficCost(values: Record<string, number>) {
  const { usersPerDay, requestsPerSecond, cacheHitRatio } = values;

  // Assumptions
  const avgResponseSize = 50; // KB
  const serverCostPerHour = 0.10; // $0.10/hour for server
  const bandwidthCostPerGB = 0.09; // $0.09/GB
  const cacheCostPerGB = 0.02; // $0.02/GB for cache storage

  // Calculations
  const requestsPerDay = usersPerDay * 10; // Assume 10 requests per user per day
  const requestsPerMonth = requestsPerDay * 30;
  const cacheHits = requestsPerMonth * (cacheHitRatio / 100);
  const cacheMisses = requestsPerMonth - cacheHits;

  // Server costs (based on requests/sec, need servers to handle load)
  const serversNeeded = Math.ceil(requestsPerSecond / 1000); // 1000 req/s per server
  const serverCost = serversNeeded * serverCostPerHour * 24 * 30;

  // Bandwidth costs
  const bandwidthGB = (cacheMisses * avgResponseSize) / (1024 * 1024);
  const bandwidthCost = bandwidthGB * bandwidthCostPerGB;

  // Cache costs (storage + operations)
  const cacheStorageGB = 10; // Assume 10GB cache
  const cacheStorageCost = cacheStorageGB * cacheCostPerGB;
  const cacheOpsCost = cacheHits * 0.000001; // $0.000001 per cache hit
  const totalCacheCost = cacheStorageCost + cacheOpsCost;

  const total = serverCost + bandwidthCost + totalCacheCost;

  const breakdown = [
    {
      component: "Server Infrastructure",
      cost: serverCost,
      percentage: (serverCost / total) * 100,
    },
    {
      component: "Bandwidth",
      cost: bandwidthCost,
      percentage: (bandwidthCost / total) * 100,
    },
    {
      component: "Cache",
      cost: totalCacheCost,
      percentage: (totalCacheCost / total) * 100,
    },
  ];

  // Chart data - show cost at different traffic levels
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const multiplier = (i + 1) * 0.2;
    const scaledUsers = usersPerDay * multiplier;
    const scaledRPS = requestsPerSecond * multiplier;
    const scaledServers = Math.ceil(scaledRPS / 1000);
    const scaledServerCost = scaledServers * serverCostPerHour * 24 * 30;
    const scaledRequests = scaledUsers * 10 * 30;
    const scaledCacheMisses = scaledRequests * (1 - cacheHitRatio / 100);
    const scaledBandwidth = (scaledCacheMisses * avgResponseSize) / (1024 * 1024);
    const scaledBandwidthCost = scaledBandwidth * bandwidthCostPerGB;
    return {
      label: `${(multiplier * 100).toFixed(0)}%`,
      cost: scaledServerCost + scaledBandwidthCost + totalCacheCost,
    };
  });

  return { total, breakdown, chartData };
}

export default function TrafficSimulatorPage() {
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
            title="Traffic Simulator"
            description="Explore how server costs, bandwidth, and cache hit ratios impact total infrastructure costs as traffic scales."
            inputs={[
              {
                key: "usersPerDay",
                label: "Users per Day",
                initialValue: 10000,
                min: 1000,
                max: 1000000,
                step: 1000,
                unit: "users",
              },
              {
                key: "requestsPerSecond",
                label: "Requests per Second",
                initialValue: 100,
                min: 10,
                max: 10000,
                step: 10,
                unit: "req/s",
              },
              {
                key: "cacheHitRatio",
                label: "Cache Hit Ratio",
                initialValue: 80,
                min: 0,
                max: 99,
                step: 1,
                unit: "%",
              },
            ]}
            calculate={calculateTrafficCost}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
