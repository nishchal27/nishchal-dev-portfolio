"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DiagramViewer } from "@/components/lab/architecture/diagram-viewer";
import { aiAppArchitecture } from "@/data/architectures";

export default function AIAppPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <Link
            href="/lab/architecture"
            className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Architecture Demos
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {aiAppArchitecture.title}
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl mb-4">
              {aiAppArchitecture.description}
            </p>
            <p className="text-sm text-text-secondary italic">
              Architecture for monitoring and optimizing AI infrastructure costs in production applications.
            </p>
          </div>

          <div className="mb-8">
            <DiagramViewer
              nodes={aiAppArchitecture.nodes}
              edges={aiAppArchitecture.edges}
              components={aiAppArchitecture.components}
            />
          </div>

          <div className="max-w-3xl space-y-6 text-text-secondary">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Key Design Decisions
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary">Token tracking:</strong> Separate service
                    for token tracking enables accurate cost calculation and billing.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary">Response caching:</strong> Caching identical
                    prompts dramatically reduces costs but requires careful cache key design.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary">Rate limiting:</strong> Per-user rate limits
                    prevent abuse and control costs, implemented with Redis sliding window.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
