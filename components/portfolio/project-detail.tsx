"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectScreenshotGallery } from "@/components/portfolio/project-screenshot-gallery";
import { ProjectWorkflow } from "@/components/portfolio/project-workflow";
import type { Project } from "@/data/portfolio";

interface ProjectDetailProps {
  project: Project;
}

const categoryColors: Record<string, string> = {
  SaaS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Mobile: "bg-green-500/10 text-green-400 border-green-500/20",
  Platform: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Web: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Backend: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function ProjectDetail({ project }: ProjectDetailProps) {
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
            <span
              className={`text-sm font-medium px-3 py-1 rounded border ${categoryColors[project.category] || categoryColors.Web}`}
            >
              {project.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            {project.name}
          </h1>
          <p className="text-xl text-text-secondary mb-6">
            {project.tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Visit Live Site
              </Button>
            )}
            {project.githubUrl && (
              <Button
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            )}
          </div>
        </div>

        {/* Screenshots — hero gallery */}
        {project.screenshots && project.screenshots.length > 0 && (
          <motion.section variants={fadeInUp} className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">In the app</h2>
            <ProjectScreenshotGallery
              screenshots={project.screenshots}
              projectName={project.name}
            />
          </motion.section>
        )}

        {/* Overview */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-lg leading-8 text-text-secondary">
            {project.description}
          </p>
        </motion.section>

        {/* Workflow (when present, e.g. WIO OS) */}
        {project.workflow && (
          <ProjectWorkflow
            title={project.workflow.title}
            summary={project.workflow.summary}
            steps={project.workflow.steps}
          />
        )}

        {/* Problem & Solution */}
        <motion.div variants={fadeInUp} className="grid gap-6 sm:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">{project.problem}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">{project.solution}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Features */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-surface"
              >
                <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-text-secondary">{feature}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Engineering Highlights */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Engineering Focus</h2>
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

        {/* Target Audience */}
        <motion.section variants={fadeInUp} className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Built For</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">{project.targetAudience}</p>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </motion.article>
  );
}
