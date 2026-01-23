"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsProps {
  skills: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
    tools: string[];
  };
}

export function Skills({ skills }: SkillsProps) {
  const skillCategories = [
    { title: "Frontend", items: skills.frontend },
    { title: "Backend", items: skills.backend },
    { title: "Infrastructure", items: skills.infrastructure },
    { title: "Tools", items: skills.tools },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="container mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-3xl font-bold tracking-tight sm:text-4xl mb-12"
      >
        Skills
      </motion.h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((category, index) => (
          <motion.div key={category.title} variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((skill) => (
                    <li
                      key={skill}
                      className="text-sm text-text-secondary font-mono"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
