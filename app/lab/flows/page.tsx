"use client";

import { motion } from "framer-motion";
import { Workflow, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { flows } from "@/data/flows";

export default function FlowsPage() {
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
                <Workflow className="h-6 w-6 text-accent" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Interactive Flows
              </h1>
            </div>
            <p className="text-lg text-text-secondary max-w-3xl">
              Step-by-step visual flows for complex systems. Click on steps to
              explore details, edge cases, and failure handling.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {flows.map((flow) => (
              <motion.div key={flow.slug} variants={fadeInUp}>
                <Link href={`/lab/flows/${flow.slug}`}>
                  <Card className="h-full hover:border-accent transition-colors group">
                    <CardHeader>
                      <CardTitle>{flow.title}</CardTitle>
                      <CardDescription>{flow.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        Explore Flow
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
