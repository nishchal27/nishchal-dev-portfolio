"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackendSystemsBadge } from "@/components/ui/backend-systems-badge";
import type { Project } from "@/data/portfolio";

interface ProjectsShowcaseProps {
  projects: Project[];
}

const categoryColors: Record<string, string> = {
  SaaS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Mobile: "bg-green-500/10 text-green-400 border-green-500/20",
  Platform: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Web: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Backend: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.div variants={fadeInUp} className="max-w-3xl mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
          Projects
        </h1>
        <p className="text-lg leading-8 text-text-secondary sm:text-xl">
          A collection of production-ready software systems I've built and shipped. Each project represents real engineering work—from architecture decisions to deployment.
        </p>
      </motion.div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <motion.div key={project.slug} variants={fadeInUp}>
            <Link href={`/projects/${project.slug}`}>
              <Card className="h-full flex flex-col hover:border-accent transition-all hover:shadow-lg cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {project.category === "Backend" ? (
                          <BackendSystemsBadge />
                        ) : (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded border ${categoryColors[project.category] || categoryColors.Web}`}
                          >
                            {project.category}
                          </span>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-accent transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {project.tagline}
                      </CardDescription>
                    </div>
                    {(project.liveUrl || project.githubUrl) && (
                      <ExternalLink className="h-4 w-4 text-text-secondary group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-auto">
                    <p className="text-xs text-text-secondary mb-2">
                      For: {project.targetAudience}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-1 rounded bg-surface border border-border text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs font-mono px-2 py-1 rounded bg-surface border border-border text-text-secondary">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
