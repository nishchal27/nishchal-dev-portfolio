"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArchitecturePlanner } from "@/components/lab/ai/architecture-planner";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function AIArchitecturePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-12"
          >
            <Link
              href="/lab"
              className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lab
            </Link>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              AI Architecture Planner
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl">
              Get AI-powered system architecture recommendations. Describe your
              app idea and constraints, and receive a production-ready
              architecture with components, connections, tradeoffs, and scaling
              considerations.
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Free, stateless, no login required. Rate limited to prevent abuse.
            </p>
          </motion.div>

          <ArchitecturePlanner />
        </div>
      </main>
      <Footer />
    </>
  );
}
