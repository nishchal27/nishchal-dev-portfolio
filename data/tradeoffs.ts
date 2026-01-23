export interface TradeoffOption {
  name: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  worstFor: string[];
  scaling: {
    reads: "excellent" | "good" | "fair" | "poor";
    writes: "excellent" | "good" | "fair" | "poor";
    horizontal: "excellent" | "good" | "fair" | "poor";
  };
}

export interface TradeoffData {
  slug: string;
  title: string;
  problem: string;
  constraints: string[];
  options: TradeoffOption[];
  decision: {
    framework: string;
    recommendation: string;
    reasoning: string;
  };
  scaling: string;
}

export const tradeoffs: TradeoffData[] = [
  {
    slug: "server-actions-vs-api-routes",
    title: "Server Actions vs API Routes in Next.js",
    problem:
      "Choosing between Next.js Server Actions and traditional API Routes for handling mutations and data operations.",
    constraints: [
      "Using Next.js App Router",
      "TypeScript project with type safety requirements",
      "Some operations may need external webhook access",
      "Team prefers simpler patterns when possible",
    ],
    options: [
      {
        name: "Server Actions",
        pros: [
          "End-to-end type safety (no manual types)",
          "Less boilerplate (no route handlers)",
          "Automatic form handling and progressive enhancement",
          "Simpler mental model for mutations",
          "Better integration with React Server Components",
        ],
        cons: [
          "Next.js only (not accessible via HTTP directly)",
          "Less flexible for complex middleware needs",
          "Harder to test in isolation",
          "No direct HTTP access for external clients",
        ],
        bestFor: [
          "Form submissions and mutations",
          "Internal operations within Next.js app",
          "Rapid development with type safety",
          "When you don't need external API access",
        ],
        worstFor: [
          "Public REST APIs",
          "External webhook handlers",
          "Complex middleware requirements",
          "Non-Next.js clients",
        ],
        scaling: {
          reads: "excellent",
          writes: "excellent",
          horizontal: "excellent",
        },
      },
      {
        name: "API Routes",
        pros: [
          "Standard HTTP interface (works with any client)",
          "More control over request/response",
          "Easier to test with standard HTTP tools",
          "Better for webhooks and external integrations",
          "More familiar pattern for backend developers",
        ],
        cons: [
          "More boilerplate code",
          "Manual type safety (need to define types)",
          "No automatic form handling",
          "More code to maintain",
        ],
        bestFor: [
          "Public APIs",
          "Webhook handlers",
          "External integrations",
          "When you need HTTP flexibility",
        ],
        worstFor: [
          "Simple form submissions",
          "Next.js-only applications",
          "When Server Actions would suffice",
        ],
        scaling: {
          reads: "excellent",
          writes: "excellent",
          horizontal: "excellent",
        },
      },
    ],
    decision: {
      framework:
        "Consider: client type (Next.js only vs external), complexity, type safety needs, testing requirements, webhook needs",
      recommendation:
        "Use Server Actions for Next.js-only mutations and forms. Use API Routes for public APIs, webhooks, and external integrations.",
      reasoning:
        "For AuthorAI, I used Server Actions for internal credit operations and form submissions, but API Routes for Stripe webhooks. This gives us type safety where it matters most while maintaining flexibility for external integrations.",
    },
    scaling:
      "Both scale the same way in Next.js. Server Actions benefit from React Server Components caching. API Routes give you more control over caching headers and can be easier to optimize for specific use cases.",
  },
  {
    slug: "postgresql-vs-mongodb",
    title: "PostgreSQL vs MongoDB for SaaS",
    problem:
      "Choosing a database for a SaaS application with financial transactions, user data, and content storage.",
    constraints: [
      "Need ACID transactions for payments",
      "Complex queries and relationships",
      "Team is familiar with SQL",
      "May need to scale horizontally later",
    ],
    options: [
      {
        name: "PostgreSQL",
        pros: [
          "Strong ACID guarantees (critical for payments)",
          "Powerful SQL for complex queries",
          "Excellent for relational data",
          "JSON support (best of both worlds)",
          "Mature ecosystem and tooling",
        ],
        cons: [
          "Horizontal scaling is complex",
          "Schema changes require migrations",
          "Can be overkill for simple use cases",
        ],
        bestFor: [
          "Financial applications (payments, credits)",
          "Applications with complex relationships",
          "When you need strong consistency",
          "SaaS with user accounts and transactions",
        ],
        worstFor: [
          "Simple key-value lookups",
          "Rapidly changing schemas",
          "Very high write throughput (without sharding)",
        ],
        scaling: {
          reads: "excellent",
          writes: "good",
          horizontal: "fair",
        },
      },
      {
        name: "MongoDB",
        pros: [
          "Flexible schema (easy to evolve)",
          "Excellent horizontal scaling",
          "Great for document-based data",
          "Fast writes for simple operations",
        ],
        cons: [
          "Weaker consistency guarantees",
          "Complex queries are harder",
          "No joins (must denormalize or application-level joins)",
          "Transaction support is limited",
        ],
        bestFor: [
          "Content management systems",
          "Real-time analytics",
          "IoT data",
          "Catalogs with varying schemas",
        ],
        worstFor: [
          "Financial transactions",
          "Complex relational queries",
          "Strict ACID requirements",
        ],
        scaling: {
          reads: "excellent",
          writes: "good",
          horizontal: "excellent",
        },
      },
    ],
    decision: {
      framework:
        "Consider: data structure (relational vs documents), consistency requirements, query complexity, team expertise, scaling needs",
      recommendation:
        "PostgreSQL for SaaS with payments and user data. MongoDB when you have clear document-based needs and need horizontal scaling from day one.",
      reasoning:
        "For AuthorAI and other SaaS products, PostgreSQL was the right choice because we needed ACID transactions for credit operations and payment processing. The relational model fits user accounts, transactions, and content metadata well. JSON columns handle flexible content data when needed.",
    },
    scaling:
      "PostgreSQL: Use read replicas for read scaling, consider connection pooling (PgBouncer). MongoDB: Native sharding, but requires careful shard key selection. For most SaaS apps, PostgreSQL with proper indexing and read replicas scales well.",
  },
  {
    slug: "cache-vs-db-direct",
    title: "Cache vs Database: When to Use What",
    problem:
      "Deciding when to add a cache layer (Redis) versus querying the database directly for frequently accessed data.",
    constraints: [
      "Need fast response times for user-facing queries",
      "Data changes infrequently (user profiles, content metadata)",
      "High read volume on credit balances",
      "Budget constraints (cache adds cost)",
    ],
    options: [
      {
        name: "Database Only",
        pros: [
          "Single source of truth",
          "No cache invalidation complexity",
          "Always fresh data",
          "Simpler architecture",
          "Lower infrastructure cost",
        ],
        cons: [
          "Slower for frequent reads",
          "Higher database load",
          "More expensive at scale (DB connections)",
          "Limited by DB connection pool",
        ],
        bestFor: [
          "Low read volume",
          "Data changes frequently",
          "Simple applications",
          "When consistency is critical",
        ],
        worstFor: [
          "High read volume",
          "Expensive queries",
          "Slow database",
          "When latency matters",
        ],
        scaling: {
          reads: "fair",
          writes: "good",
          horizontal: "fair",
        },
      },
      {
        name: "Cache + Database",
        pros: [
          "Dramatically faster reads (sub-millisecond)",
          "Reduces database load",
          "Better user experience",
          "Cost effective at scale",
          "Enables higher throughput",
        ],
        cons: [
          "Cache invalidation complexity",
          "Stale data risk",
          "Additional infrastructure",
          "More moving parts",
        ],
        bestFor: [
          "High read volume",
          "Data changes infrequently",
          "Expensive queries",
          "When performance matters",
        ],
        worstFor: [
          "Frequently changing data",
          "When consistency is critical",
          "Simple, low-traffic apps",
        ],
        scaling: {
          reads: "excellent",
          writes: "good",
          horizontal: "excellent",
        },
      },
    ],
    decision: {
      framework:
        "Consider: read/write ratio, data freshness requirements, query cost, traffic volume, consistency needs",
      recommendation:
        "Use cache when: read volume is high, data changes infrequently, or queries are expensive. Use DB only when: data changes frequently or consistency is critical.",
      reasoning:
        "For AuthorAI, I cache user credit balances and session data in Redis. Credit balances are updated infrequently (only on purchase or usage), and reads happen on every API request. The cache reduces DB load by 80%+ and improves response times. However, credit deductions always hit the DB first for consistency, then update cache.",
    },
    scaling:
      "Database: Add read replicas, but limited by replication lag. Cache: Horizontal scaling is straightforward with Redis Cluster. Cache hit ratio is the key metric - aim for 80%+ for effective caching.",
  },
  {
    slug: "ai-cost-optimization",
    title: "AI Cost Optimization Strategies",
    problem:
      "Managing and optimizing costs for AI/LLM API usage in production applications with variable usage patterns.",
    constraints: [
      "AI API costs scale with usage",
      "Need to maintain response quality",
      "Users have different usage patterns",
      "Budget constraints",
    ],
    options: [
      {
        name: "Response Caching",
        pros: [
          "Dramatic cost savings for repeated queries",
          "Faster response times",
          "Reduces API rate limit pressure",
        ],
        cons: [
          "May serve stale responses",
          "Cache key design is critical",
          "Storage costs for cached responses",
        ],
        bestFor: [
          "Repeated or similar queries",
          "When slight staleness is acceptable",
          "High-traffic endpoints",
        ],
        worstFor: [
          "Unique queries every time",
          "When freshness is critical",
          "Low-traffic endpoints",
        ],
        scaling: {
          reads: "excellent",
          writes: "excellent",
          horizontal: "excellent",
        },
      },
      {
        name: "Prompt Optimization",
        pros: [
          "Reduces token usage per request",
          "Improves response quality",
          "No infrastructure changes needed",
        ],
        cons: [
          "Requires iterative testing",
          "Time investment in prompt engineering",
          "May reduce flexibility",
        ],
        bestFor: [
          "High-volume endpoints",
          "When you control the prompts",
          "Long-term cost reduction",
        ],
        worstFor: [
          "User-generated prompts",
          "When flexibility is more important",
        ],
        scaling: {
          reads: "excellent",
          writes: "excellent",
          horizontal: "excellent",
        },
      },
      {
        name: "Model Selection",
        pros: [
          "Different models have different costs",
          "Can use cheaper models for simple tasks",
          "Mix models based on complexity",
        ],
        cons: [
          "Adds complexity to routing logic",
          "Quality may vary between models",
          "More models to maintain",
        ],
        bestFor: [
          "Applications with varied complexity",
          "When cost is primary concern",
          "When you can route intelligently",
        ],
        worstFor: [
          "When consistency is critical",
          "Simple applications",
        ],
        scaling: {
          reads: "excellent",
          writes: "excellent",
          horizontal: "excellent",
        },
      },
    ],
    decision: {
      framework:
        "Consider: query patterns, freshness requirements, budget, response quality needs, traffic volume",
      recommendation:
        "Combine strategies: cache repeated queries, optimize prompts for high-volume endpoints, use appropriate models for task complexity. Monitor costs and adjust.",
      reasoning:
        "For AuthorAI, I implemented response caching for common content generation patterns, optimized prompts to reduce token usage by ~30%, and use GPT-4 for complex tasks while GPT-3.5 for simpler ones. This reduced costs by ~60% while maintaining quality.",
    },
    scaling:
      "All strategies scale well. Caching becomes more effective with higher traffic. Prompt optimization compounds over time. Model selection requires monitoring to ensure quality doesn't degrade.",
  },
];
