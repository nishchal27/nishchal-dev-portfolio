import { Node, Edge } from "reactflow";

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: "service" | "database" | "cache" | "queue" | "cdn" | "gateway" | "vector-db";
  description: string;
  technologies?: string[];
  tradeoffs?: string[];
  failurePoints?: string[];
}

export interface ArchitectureData {
  title: string;
  description: string;
  components: ArchitectureComponent[];
  nodes: Node[];
  edges: Edge[];
}

export const saasArchitecture: ArchitectureData = {
  title: "AI-Powered SaaS Architecture (AuthorAI)",
  description:
    "Production architecture for an AI content generation platform with credit-based monetization, vector search, and scalable media processing.",
  components: [
    {
      id: "cdn",
      name: "CDN",
      type: "cdn",
      description: "Serves static assets and cached media. Critical for image delivery performance.",
      technologies: ["Vercel Edge", "Cloudflare"],
      tradeoffs: [
        "Global edge caching reduces origin load",
        "Image optimization at edge improves UX",
        "Cache invalidation requires careful strategy",
      ],
      failurePoints: ["Cache stampede on invalidation", "Edge location failures"],
    },
    {
      id: "gateway",
      name: "API Gateway",
      type: "gateway",
      description: "Next.js API routes with middleware for auth, rate limiting, and request validation.",
      technologies: ["Next.js App Router", "Middleware"],
      tradeoffs: [
        "Unified auth and rate limiting",
        "Type-safe API with TypeScript",
        "Can become bottleneck without proper caching",
      ],
      failurePoints: ["Rate limit misconfiguration", "Middleware execution order issues"],
    },
    {
      id: "auth",
      name: "Auth Service",
      type: "service",
      description: "Handles user authentication, session management, and credit balance checks.",
      technologies: ["NextAuth.js", "JWT", "PostgreSQL"],
      tradeoffs: [
        "Stateless JWT reduces DB queries",
        "Credit checks require DB lookup (necessary for accuracy)",
        "Session refresh complexity",
      ],
      failurePoints: ["Token expiration edge cases", "Credit race conditions"],
    },
    {
      id: "api",
      name: "API Services",
      type: "service",
      description: "Core business logic: AI requests, credit deduction, media processing orchestration.",
      technologies: ["Next.js Server Actions", "TypeScript"],
      tradeoffs: [
        "Server Actions provide type safety",
        "Simpler than separate API routes for internal ops",
        "Less flexible for external clients",
      ],
      failurePoints: ["Long-running AI requests timeout", "Credit deduction failures"],
    },
    {
      id: "ai-service",
      name: "AI Service Layer",
      type: "service",
      description: "Abstraction over multiple LLM providers with retry logic, cost tracking, and streaming.",
      technologies: ["OpenAI API", "Anthropic", "Custom wrapper"],
      tradeoffs: [
        "Provider abstraction enables switching",
        "Centralized cost tracking",
        "Adds latency layer",
      ],
      failurePoints: ["Provider rate limits", "Token calculation errors", "Streaming interruptions"],
    },
    {
      id: "vector-db",
      name: "Vector Database",
      type: "vector-db",
      description: "Stores content embeddings for semantic search and filtering.",
      technologies: ["Pinecone", "pgvector"],
      tradeoffs: [
        "Enables semantic search over keyword",
        "Additional infrastructure cost",
        "Embedding generation adds latency",
      ],
      failurePoints: ["Embedding dimension mismatches", "Vector DB downtime"],
    },
    {
      id: "cache",
      name: "Redis Cache",
      type: "cache",
      description: "Caches user sessions, credit balances, and frequently accessed content.",
      technologies: ["Redis", "Upstash"],
      tradeoffs: [
        "Dramatically reduces DB load",
        "Session caching improves response time",
        "Cache invalidation on credit updates is critical",
      ],
      failurePoints: ["Cache misses on credit checks", "Stale balance data"],
    },
    {
      id: "db",
      name: "PostgreSQL",
      type: "database",
      description: "Primary database for users, credits, transactions, and content metadata.",
      technologies: ["PostgreSQL", "Prisma ORM"],
      tradeoffs: [
        "Strong consistency for financial data",
        "ACID transactions for credit operations",
        "Vertical scaling limits",
      ],
      failurePoints: ["Connection pool exhaustion", "Long-running queries block writes"],
    },
    {
      id: "queue",
      name: "Background Jobs",
      type: "queue",
      description: "Handles async tasks: image processing, email notifications, webhook processing.",
      technologies: ["BullMQ", "Vercel Cron"],
      tradeoffs: [
        "Decouples heavy work from API",
        "Enables retry logic for failures",
        "Adds eventual consistency complexity",
      ],
      failurePoints: ["Job queue backlog", "Failed job retries exhaust resources"],
    },
    {
      id: "storage",
      name: "Object Storage",
      type: "service",
      description: "Stores generated images and media files with CDN integration.",
      technologies: ["AWS S3", "Vercel Blob"],
      tradeoffs: [
        "Scalable storage without DB bloat",
        "CDN integration improves delivery",
        "Cost scales with usage",
      ],
      failurePoints: ["Upload failures", "Storage quota exceeded"],
    },
  ],
  nodes: [
    {
      id: "cdn",
      type: "default",
      position: { x: 400, y: 0 },
      data: { label: "CDN" },
    },
    {
      id: "gateway",
      type: "default",
      position: { x: 400, y: 100 },
      data: { label: "API Gateway" },
    },
    {
      id: "auth",
      type: "default",
      position: { x: 200, y: 200 },
      data: { label: "Auth Service" },
    },
    {
      id: "api",
      type: "default",
      position: { x: 400, y: 200 },
      data: { label: "API Services" },
    },
    {
      id: "ai-service",
      type: "default",
      position: { x: 600, y: 200 },
      data: { label: "AI Service" },
    },
    {
      id: "vector-db",
      type: "default",
      position: { x: 600, y: 350 },
      data: { label: "Vector DB" },
    },
    {
      id: "cache",
      type: "default",
      position: { x: 200, y: 350 },
      data: { label: "Redis Cache" },
    },
    {
      id: "db",
      type: "default",
      position: { x: 400, y: 350 },
      data: { label: "PostgreSQL" },
    },
    {
      id: "queue",
      type: "default",
      position: { x: 0, y: 350 },
      data: { label: "Job Queue" },
    },
    {
      id: "storage",
      type: "default",
      position: { x: 800, y: 350 },
      data: { label: "Object Storage" },
    },
  ],
  edges: [
    { id: "e1", source: "cdn", target: "gateway" },
    { id: "e2", source: "gateway", target: "auth" },
    { id: "e3", source: "gateway", target: "api" },
    { id: "e4", source: "api", target: "ai-service" },
    { id: "e5", source: "api", target: "vector-db" },
    { id: "e6", source: "api", target: "cache" },
    { id: "e7", source: "api", target: "db" },
    { id: "e8", source: "api", target: "queue" },
    { id: "e9", source: "queue", target: "storage" },
  ],
};

export const aiAppArchitecture: ArchitectureData = {
  title: "AI Cost Monitoring Architecture",
  description:
    "Architecture for tracking and analyzing AI API usage, token consumption, and cost trends across teams and projects.",
  components: [
    {
      id: "client",
      name: "Dashboard Client",
      type: "service",
      description: "React dashboard for visualizing usage, costs, and trends.",
    },
    {
      id: "api",
      name: "Analytics API",
      type: "service",
      description: "Aggregates usage data, calculates costs, and serves analytics queries.",
      technologies: ["Next.js", "TypeScript"],
    },
    {
      id: "collector",
      name: "Usage Collector",
      type: "service",
      description: "Collects usage events from AI service wrappers via webhooks or direct logging.",
      technologies: ["Webhook endpoints", "Event streaming"],
    },
    {
      id: "aggregator",
      name: "Data Aggregator",
      type: "service",
      description: "Processes raw events into time-series aggregates for efficient querying.",
      technologies: ["Background jobs", "Time-series DB"],
      tradeoffs: [
        "Pre-aggregation enables fast queries",
        "Reduces storage for historical data",
        "Adds processing latency",
      ],
    },
    {
      id: "db",
      name: "Time-Series DB",
      type: "database",
      description: "Stores aggregated usage metrics by time buckets (hourly, daily).",
      technologies: ["PostgreSQL", "TimescaleDB extension"],
      tradeoffs: [
        "Efficient time-range queries",
        "Compression reduces storage",
        "Less flexible than raw event storage",
      ],
    },
    {
      id: "cache",
      name: "Query Cache",
      type: "cache",
      description: "Caches expensive aggregation queries for dashboard views.",
      technologies: ["Redis"],
    },
  ],
  nodes: [
    {
      id: "client",
      type: "default",
      position: { x: 400, y: 0 },
      data: { label: "Dashboard" },
    },
    {
      id: "api",
      type: "default",
      position: { x: 400, y: 150 },
      data: { label: "Analytics API" },
    },
    {
      id: "collector",
      type: "default",
      position: { x: 200, y: 300 },
      data: { label: "Usage Collector" },
    },
    {
      id: "aggregator",
      type: "default",
      position: { x: 400, y: 300 },
      data: { label: "Data Aggregator" },
    },
    {
      id: "db",
      type: "default",
      position: { x: 400, y: 450 },
      data: { label: "Time-Series DB" },
    },
    {
      id: "cache",
      type: "default",
      position: { x: 600, y: 300 },
      data: { label: "Query Cache" },
    },
  ],
  edges: [
    { id: "e1", source: "client", target: "api" },
    { id: "e2", source: "api", target: "cache" },
    { id: "e3", source: "api", target: "db" },
    { id: "e4", source: "collector", target: "aggregator" },
    { id: "e5", source: "aggregator", target: "db" },
  ],
};

export const authPaymentsArchitecture: ArchitectureData = {
  title: "Credit-Based Payment Architecture",
  description:
    "Credit system with Stripe integration, usage tracking, and idempotent payment processing for SaaS monetization.",
  components: [
    {
      id: "client",
      name: "Client App",
      type: "service",
      description: "Frontend application initiating purchases and credit top-ups.",
    },
    {
      id: "api",
      name: "Payment API",
      type: "service",
      description: "Handles credit purchases, Stripe checkout creation, and webhook processing.",
      technologies: ["Next.js", "Stripe SDK"],
    },
    {
      id: "stripe",
      name: "Stripe",
      type: "service",
      description: "Payment processing with checkout sessions and webhooks.",
      technologies: ["Stripe Checkout", "Stripe Webhooks"],
      tradeoffs: [
        "Handles PCI compliance",
        "Reliable webhook delivery",
        "Vendor lock-in",
      ],
    },
    {
      id: "webhook",
      name: "Webhook Handler",
      type: "service",
      description: "Processes Stripe webhooks with signature verification and idempotency.",
      technologies: ["Stripe webhooks", "Idempotency keys"],
      failurePoints: ["Webhook replay attacks", "Signature verification failures"],
    },
    {
      id: "credit-service",
      name: "Credit Service",
      type: "service",
      description: "Manages credit balances, deductions, and top-ups with transaction logging.",
      technologies: ["PostgreSQL", "Transactions"],
      tradeoffs: [
        "ACID transactions ensure consistency",
        "Row-level locking prevents race conditions",
        "Can become bottleneck at high concurrency",
      ],
    },
    {
      id: "db",
      name: "Database",
      type: "database",
      description: "Stores users, credit balances, transactions, and idempotency keys.",
      technologies: ["PostgreSQL"],
    },
  ],
  nodes: [
    {
      id: "client",
      type: "default",
      position: { x: 400, y: 0 },
      data: { label: "Client App" },
    },
    {
      id: "api",
      type: "default",
      position: { x: 400, y: 150 },
      data: { label: "Payment API" },
    },
    {
      id: "stripe",
      type: "default",
      position: { x: 600, y: 150 },
      data: { label: "Stripe" },
    },
    {
      id: "webhook",
      type: "default",
      position: { x: 400, y: 300 },
      data: { label: "Webhook Handler" },
    },
    {
      id: "credit-service",
      type: "default",
      position: { x: 200, y: 300 },
      data: { label: "Credit Service" },
    },
    {
      id: "db",
      type: "default",
      position: { x: 400, y: 450 },
      data: { label: "Database" },
    },
  ],
  edges: [
    { id: "e1", source: "client", target: "api" },
    { id: "e2", source: "api", target: "stripe" },
    { id: "e3", source: "api", target: "credit-service" },
    { id: "e4", source: "stripe", target: "webhook" },
    { id: "e5", source: "webhook", target: "credit-service" },
    { id: "e6", source: "credit-service", target: "db" },
    { id: "e7", source: "api", target: "db" },
  ],
};
