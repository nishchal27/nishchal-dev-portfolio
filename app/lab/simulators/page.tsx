"use client";

import { motion } from "framer-motion";
import { Calculator, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const simulators = [
  {
    title: "Traffic Simulator",
    description:
      "Explore how server costs, bandwidth, and cache hit ratios change with traffic volume.",
    href: "/lab/simulators/traffic",
  },
  {
    title: "API Usage Simulator",
    description:
      "Calculate compute costs, database load, and caching benefits based on API usage patterns.",
    href: "/lab/simulators/api",
  },
  {
    title: "AI Token Cost Simulator",
    description:
      "Estimate AI token costs, monthly expenses, and optimization impact for LLM-powered applications.",
    href: "/lab/simulators/ai-tokens",
  },
];

export default function SimulatorsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 py-24 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="mb-12">
            <Link
              href="/lab"
              className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lab
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-accent/10 p-2">
                <Calculator className="h-6 w-6 text-accent" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Cost & Performance Simulators
              </h1>
            </div>
            <p className="text-lg text-text-secondary max-w-3xl">
              Interactive tools to explore how cost and performance change with
              scale. Adjust parameters and see real-time calculations.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {simulators.map((simulator) => (
              <motion.div key={simulator.title} variants={fadeInUp}>
                <Link href={simulator.href}>
                  <Card className="h-full hover:border-accent transition-colors group">
                    <CardHeader>
                      <CardTitle>{simulator.title}</CardTitle>
                      <CardDescription>{simulator.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        Open Simulator
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
