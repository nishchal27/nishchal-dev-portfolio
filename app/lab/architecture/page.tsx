"use client";

import { motion } from "framer-motion";
import { Network, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const architectureDemos = [
  {
    title: "AI-Powered SaaS Architecture",
    description:
      "Production architecture for AuthorAI: credit-based monetization, vector search, AI service layer, and scalable media processing.",
    href: "/lab/architecture/saas",
    features: [
      "Credit-based monetization",
      "AI service abstraction",
      "Vector search with embeddings",
      "Stripe payment integration",
      "Background job processing",
    ],
  },
  {
    title: "AI Cost Monitoring",
    description:
      "Architecture for tracking and analyzing AI API usage, token consumption, and cost trends with time-series aggregation.",
    href: "/lab/architecture/ai-app",
    features: [
      "Usage collection",
      "Time-series aggregation",
      "Cost analytics",
      "Query optimization",
      "Dashboard visualization",
    ],
  },
  {
    title: "Credit-Based Payment System",
    description:
      "Credit system with Stripe integration, usage tracking, and idempotent payment processing for SaaS monetization.",
    href: "/lab/architecture/auth-payments",
    features: [
      "Stripe checkout integration",
      "Webhook processing",
      "Credit balance management",
      "Idempotency handling",
      "Transaction logging",
    ],
  },
];

export default function ArchitecturePage() {
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
                <Network className="h-6 w-6 text-accent" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Architecture Demos
              </h1>
            </div>
            <p className="text-lg text-text-secondary max-w-3xl">
              Interactive system architecture diagrams showing components, data
              flow, and failure points. Click on components to explore details
              and tradeoffs.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {architectureDemos.map((demo) => (
              <motion.div key={demo.title} variants={fadeInUp}>
                <Link href={demo.href}>
                  <Card className="h-full hover:border-accent transition-colors">
                    <CardHeader>
                      <CardTitle>{demo.title}</CardTitle>
                      <CardDescription>{demo.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {demo.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-sm text-text-secondary flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
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
