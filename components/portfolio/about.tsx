"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface AboutProps {
  bio: string;
}

export function About({ bio }: AboutProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="container mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About
        </h2>
        <p className="mt-6 text-lg leading-8 text-text-secondary whitespace-pre-line">
          {bio}
        </p>
      </div>
    </motion.section>
  );
}
