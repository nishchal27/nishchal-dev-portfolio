"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { ProjectWorkflowStep } from "@/data/portfolio";

interface ProjectWorkflowProps {
  title: string;
  summary: string;
  steps: ProjectWorkflowStep[];
}

export function ProjectWorkflow({ title, summary, steps }: ProjectWorkflowProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mb-16"
    >
      <motion.h2 variants={fadeInUp} className="text-2xl font-semibold mb-2">
        {title}
      </motion.h2>
      <motion.p variants={fadeInUp} className="text-text-secondary mb-8 max-w-2xl">
        {summary}
      </motion.p>
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-2 lg:gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            variants={fadeInUp}
            className="flex flex-1 flex-col sm:flex-row sm:items-center"
          >
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-4 lg:p-6 flex-1 min-w-0 transition-colors hover:border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-mono text-sm font-semibold">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold truncate">{step.label}</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-6 lg:w-10 text-border">
                <ArrowRight className="h-5 w-5 text-text-secondary" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
