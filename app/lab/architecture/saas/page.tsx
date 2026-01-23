"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DiagramViewer } from "@/components/lab/architecture/diagram-viewer";
import { saasArchitecture } from "@/data/architectures";

export default function SaaSPage() {
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
              {saasArchitecture.title}
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl mb-4">
              {saasArchitecture.description}
            </p>
            <p className="text-sm text-text-secondary italic">
              Based on production architecture for AuthorAI, an AI content generation platform.
            </p>
          </div>

          <div className="mb-8">
            <DiagramViewer
              nodes={saasArchitecture.nodes}
              edges={saasArchitecture.edges}
              components={saasArchitecture.components}
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
                    <strong className="text-text-primary">Multi-tenant isolation:</strong> Using
                    database sharding to isolate tenant data while maintaining query performance.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary">Caching strategy:</strong> Redis cache
                    layer reduces database load but requires careful invalidation logic.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary">Background jobs:</strong> Job queue
                    decouples heavy processing from API responses but adds eventual consistency.
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
