"use client";

import { motion } from "framer-motion";
import { Github, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackendSystemsBadge } from "@/components/ui/backend-systems-badge";
import type { Project } from "@/data/portfolio";

interface EngineeringSystemsProps {
  projects: Project[];
}

export function EngineeringSystems({ projects }: EngineeringSystemsProps) {
  // Filter for backend/systems projects
  const backendProjects = projects.filter((p) => p.category === "Backend");

  if (backendProjects.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="container mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.div variants={fadeInUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="h-5 w-5 text-text-secondary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Engineering & Systems
          </h2>
        </div>
        <p className="text-lg text-text-secondary max-w-2xl">
          Production-minded backend systems and architecture experiments focused on performance, observability, and scalability.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {backendProjects.map((project) => (
          <motion.div key={project.slug} variants={fadeInUp}>
            <Link href={`/projects/${project.slug}`}>
              <Card className="h-full flex flex-col hover:border-slate-700/60 transition-all hover:shadow-lg cursor-pointer group border-slate-800/40 bg-surface/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <BackendSystemsBadge />
                    {project.githubUrl && (
                      <Github className="h-4 w-4 text-text-secondary group-hover:text-slate-400 transition-colors flex-shrink-0" />
                    )}
                  </div>
                  <CardTitle className="group-hover:text-slate-300 transition-colors text-xl">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    {project.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-auto space-y-3">
                    {project.engineeringGoals && project.engineeringGoals.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-text-secondary mb-2">Focus Areas:</p>
                        <ul className="space-y-1">
                          {project.engineeringGoals.slice(0, 3).map((goal, idx) => (
                            <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                              <span className="text-slate-500 mt-0.5">→</span>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-1 rounded bg-slate-900/50 border border-slate-800/50 text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900/50 border border-slate-800/50 text-slate-400">
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

      <motion.div variants={fadeInUp} className="mt-8">
        <Button href="/lab" variant="ghost" size="md">
          Explore Engineering Lab
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.section>
  );
}
