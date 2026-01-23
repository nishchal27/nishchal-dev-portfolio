"use client";

import { motion } from "framer-motion";
import {
  Network,
  GitCompare,
  Workflow,
  Calculator,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const aiFeatures = [
  {
    title: "AI Architecture Planner",
    description:
      "Get AI-powered system architecture recommendations. Describe your app idea and receive a production-ready architecture with components, tradeoffs, and scaling considerations.",
    href: "/lab/ai/architecture",
    icon: Sparkles,
    badge: "AI-Powered",
  },
  {
    title: "Feature Flow Generator",
    description:
      "Generate detailed step-by-step flows for any feature with failure points, edge cases, retry logic, and optimization tips.",
    href: "/lab/ai/flows",
    icon: Workflow,
    badge: "AI-Powered",
  },
  {
    title: "Cost & Performance Reasoner",
    description:
      "Analyze cost implications, identify optimization opportunities, and understand architecture breakpoints with AI assistance.",
    href: "/lab/ai/cost",
    icon: Calculator,
    badge: "AI-Powered",
  },
  {
    title: "Interactive System Designer",
    description:
      "Toggle infrastructure choices and see real-time AI analysis of cost, performance, and complexity implications.",
    href: "/lab/ai/system-designer",
    icon: Network,
    badge: "AI-Powered",
  },
];

const labFeatures = [
  {
    title: "Architecture Demos",
    description:
      "Interactive system architecture diagrams showing components, data flow, and failure points.",
    href: "/lab/architecture",
    icon: Network,
  },
  {
    title: "Tradeoff Explorers",
    description:
      "Compare real engineering choices: databases, APIs, caching strategies, and more.",
    href: "/lab/tradeoffs",
    icon: GitCompare,
  },
  {
    title: "Interactive Flows",
    description:
      "Step-by-step visual flows for auth, payments, AI credits, and other complex systems.",
    href: "/lab/flows",
    icon: Workflow,
  },
  {
    title: "Cost & Performance Simulators",
    description:
      "Interactive tools to explore how cost and performance change with scale.",
    href: "/lab/simulators",
    icon: Calculator,
  },
  {
    title: "Engineering Notes",
    description:
      "Short, honest writeups on design decisions, mistakes, and reflections.",
    href: "/lab/notes",
    icon: FileText,
  },
];

export default function LabPage() {
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
          <motion.div variants={fadeInUp} className="max-w-3xl mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Engineering Lab
            </h1>
            <p className="text-lg leading-8 text-text-secondary sm:text-xl">
              Interactive demos, tradeoff analyses, and engineering insights.
              Explore system design, architecture patterns, and technical
              decision-making.
            </p>
            <p className="text-sm text-text-secondary mt-4">
              Free, stateless, no login required. AI-powered tools are rate
              limited to prevent abuse.
            </p>
          </motion.div>

          {/* AI-Powered Tools Section */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold">AI-Powered Tools</h2>
            </div>
            <p className="text-text-secondary mb-6">
              Free, stateless engineering playground with real AI assistance.
              No login required. Rate limited to prevent abuse.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-16"
          >
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={fadeInUp}>
                  <Link href={feature.href}>
                    <Card className="h-full hover:border-accent transition-colors group border-accent/20">
                      <CardHeader>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-accent/10 p-2">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle>{feature.title}</CardTitle>
                              {feature.badge && (
                                <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                                  {feature.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {feature.description}
                        </CardDescription>
                        <div className="flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                          Explore
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Static Demos Section */}
          <motion.div variants={fadeInUp} className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Static Demos</h2>
            <p className="text-text-secondary">
              Pre-built examples and interactive demos.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {labFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={fadeInUp}>
                  <Link href={feature.href}>
                    <Card className="h-full hover:border-accent transition-colors group">
                      <CardHeader>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-lg bg-accent/10 p-2">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <CardTitle>{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {feature.description}
                        </CardDescription>
                        <div className="flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                          Explore
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
