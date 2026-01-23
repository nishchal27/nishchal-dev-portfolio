"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { notes } from "@/data/notes";

const categoryLabels = {
  "design-decisions": "Design Decisions",
  mistakes: "Mistakes",
  reflections: "Reflections",
};

export default function NotesPage() {
  const groupedNotes = notes.reduce(
    (acc, note) => {
      if (!acc[note.category]) {
        acc[note.category] = [];
      }
      acc[note.category].push(note);
      return acc;
    },
    {} as Record<string, typeof notes>
  );

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
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Engineering Notes
              </h1>
            </div>
            <p className="text-lg text-text-secondary max-w-3xl">
              Short, honest writeups on design decisions, mistakes, and
              reflections from building this portfolio.
            </p>
          </motion.div>

          <div className="space-y-12">
            {Object.entries(groupedNotes).map(([category, categoryNotes]) => (
              <motion.div key={category} variants={fadeInUp}>
                <h2 className="text-2xl font-semibold mb-6">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h2>
                <motion.div
                  variants={staggerContainer}
                  className="grid gap-6 sm:grid-cols-2"
                >
                  {categoryNotes.map((note) => (
                    <motion.div key={note.slug} variants={fadeInUp}>
                      <Link href={`/lab/notes/${note.slug}`}>
                        <Card className="h-full hover:border-accent transition-colors group">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle>{note.title}</CardTitle>
                              <span className="text-xs text-text-secondary font-mono">
                                {new Date(note.date).toLocaleDateString()}
                              </span>
                            </div>
                            <CardDescription>{note.excerpt}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                              Read More
                              <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
