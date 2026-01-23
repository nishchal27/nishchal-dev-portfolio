"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface HeroProps {
  name: string;
  title: string;
  tagline: string;
}

export function Hero({ name, title, tagline }: HeroProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <motion.div variants={fadeInUp} className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {name}
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-text-secondary sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mt-6 text-lg leading-8 text-text-secondary sm:text-xl">
          {tagline}
        </p>
        <div className="mt-10 flex gap-4">
          <Button href="/lab" size="lg">
            Explore Engineering Lab
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </motion.section>
  );
}
