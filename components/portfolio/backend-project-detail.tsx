"use client";

import { motion } from "framer-motion";
import { Github, ArrowLeft, Code, Zap, BarChart3, Layers } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackendSystemsBadge } from "@/components/ui/backend-systems-badge";
import type { Project } from "@/data/portfolio";

interface BackendProjectDetailProps {
  project: Project;
}

export function BackendProjectDetail({ project }: BackendProjectDetailProps) {
  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={fadeInUp} className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BackendSystemsBadge />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            {project.name}
          </h1>
          <p className="text-xl text-text-secondary mb-6">
            {project.tagline}
          </p>
          {project.githubUrl && (
            <Button
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          )}
        </div>

        {/* Overview */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-lg leading-8 text-text-secondary">
            {project.description}
          </p>
        </motion.section>

        {/* Engineering Goals */}
        {project.engineeringGoals && (
          <motion.section variants={fadeInUp} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Code className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-semibold">Engineering Goals</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {project.engineeringGoals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-accent font-mono text-sm mt-1">→</span>
                      <span className="text-text-secondary">{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* System Architecture */}
        {project.systemArchitecture && (
          <motion.section variants={fadeInUp} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-semibold">System Architecture</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {project.systemArchitecture.map((arch, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-accent font-mono text-sm mt-1">→</span>
                      <span className="text-text-secondary">{arch}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Key Experiments & Learnings */}
        {project.experiments && (
          <motion.section variants={fadeInUp} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-semibold">Key Experiments & Learnings</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.experiments.map((experiment, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="text-text-secondary">{experiment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Performance & Observability */}
        {project.performanceHighlights && (
          <motion.section variants={fadeInUp} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-semibold">Performance & Observability</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {project.performanceHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-accent font-mono text-sm mt-1">→</span>
                      <span className="text-text-secondary">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Engineering Highlights */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Technical Implementation</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {project.engineeringHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-accent font-mono text-sm mt-1">→</span>
                    <span className="text-text-secondary">{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.section>

        {/* Tech Stack */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-sm font-mono px-3 py-2 rounded bg-surface border border-border text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </motion.article>
  );
}
