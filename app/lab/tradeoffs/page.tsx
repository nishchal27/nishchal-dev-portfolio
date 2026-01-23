"use client";

import { motion } from "framer-motion";
import { GitCompare, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { tradeoffs } from "@/data/tradeoffs";

export default function TradeoffsPage() {
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
                <GitCompare className="h-6 w-6 text-accent" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Tradeoff Explorers
              </h1>
            </div>
            <p className="text-lg text-text-secondary max-w-3xl">
              Compare real engineering choices with structured analysis of
              tradeoffs, use cases, and scaling considerations.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2"
          >
            {tradeoffs.map((tradeoff) => (
              <motion.div key={tradeoff.slug} variants={fadeInUp}>
                <Link href={`/lab/tradeoffs/${tradeoff.slug}`}>
                  <Card className="h-full hover:border-accent transition-colors group">
                    <CardHeader>
                      <CardTitle>{tradeoff.title}</CardTitle>
                      <CardDescription>{tradeoff.problem}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        Explore Comparison
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
