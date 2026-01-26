export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "SaaS" | "AI" | "Mobile" | "Platform" | "Web";
  targetAudience: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  keyFeatures: string[];
  problem: string;
  solution: string;
  engineeringHighlights: string[];
}

export const portfolioData = {
  name: "Nishchal Singh",
  title: "Software Engineer",
  tagline: "Building production-ready software systems",
  bio: `I build and ship production-ready software products, ranging from SaaS platforms and AI-powered tools to mobile applications and internal dashboards. My work focuses on clean system design, performance, scalability, and thoughtful tradeoffs, with hands-on ownership across frontend, backend, databases, and integrations.`,
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native"],
    backend: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Firebase"],
    infrastructure: ["AWS", "Docker", "CI/CD", "Stripe", "Vercel"],
    tools: ["Git", "Figma", "Prisma", "Vector DBs", "Redis"],
  },
  projects: [
    {
      slug: "authorai",
      name: "AuthorAI",
      tagline: "AI-powered content & image generation SaaS",
      description:
        "A production SaaS platform that helps solo founders turn their real product activity into trust-building, conversion-ready content. Features AI-powered insight extraction, multi-format content generation, and DALL·E integration for visuals.",
      category: "SaaS",
      targetAudience: "Solo founders and creators",
      liveUrl: "https://authorai.blog",
      technologies: ["Next.js", "TypeScript", "Claude API", "DALL·E", "PostgreSQL", "Prisma", "Clerk"],
      keyFeatures: [
        "Activity tracking (GitHub integration, manual input)",
        "Claude-powered insight extraction",
        "Multi-format content generation (posts, blogs, carousels)",
        "DALL·E visual generation",
        "Human approval workflow",
        "Brand voice consistency"
      ],
      problem: "Founders struggle to create consistent, trust-building content from their real product work without marketing stress.",
      solution: "Automated content generation from real product activity, with human control at every step to ensure authenticity and brand alignment.",
      engineeringHighlights: [
        "Multi-layer architecture: Input → Insight Agent → Content Translation → Visual Generation",
        "Claude API integration for reasoning and content generation",
        "DALL·E integration for brand-aligned visuals",
        "Type-safe stack with Next.js, TypeScript, and Prisma",
        "Clerk authentication with secure API key storage"
      ],
    },
    {
      slug: "lexnify",
      name: "Lexnify",
      tagline: "Developer tools & engineering utilities platform",
      description:
        "A live SaaS platform providing high-signal developer tools and engineering utilities. Focused on performance-first architecture and tools that solve common engineering problems effectively.",
      category: "Platform",
      targetAudience: "Software engineers and developers",
      liveUrl: "https://lexnify.com",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
      keyFeatures: [
        "Developer-focused utility tools",
        "Performance-first architecture",
        "High-signal solutions for common tasks",
        "Clean, intuitive interface"
      ],
      problem: "Developers need reliable, well-designed tools for common engineering tasks without unnecessary complexity.",
      solution: "A curated platform of developer utilities built with performance and clarity as first principles.",
      engineeringHighlights: [
        "Performance-optimized architecture",
        "Clean, maintainable codebase",
        "Developer experience focus",
        "Scalable platform design"
      ],
    },
    {
      slug: "intervya",
      name: "Intervya",
      tagline: "AI-powered coding assessment & interview practice SaaS",
      description:
        "A production SaaS platform that helps engineers prepare for technical interviews through realistic practice. Tracks problem-solving patterns, identifies repeated mistakes, and provides comprehensive feedback powered by GPT-4 Turbo.",
      category: "SaaS",
      targetAudience: "Software engineers preparing for technical interviews",
      liveUrl: "https://intervya.com",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "OpenAI GPT-4", "Clerk", "Stripe", "Monaco Editor"],
      keyFeatures: [
        "Realistic interview simulation (Coding & Theory modes)",
        "Problem-solving pattern tracking",
        "Repeated mistakes identification",
        "Progress tracking and comparison",
        "Behavioral pattern analysis",
        "Structured feedback with actionable improvements"
      ],
      problem: "Engineers need realistic interview practice that provides actionable insights, not just question banks or generic feedback.",
      solution: "An interview simulator that tracks how you approach problems, identifies patterns, and provides structured feedback to help you improve systematically.",
      engineeringHighlights: [
        "Deterministic interview runtime with state machine",
        "Unified AI interface (Interview Brain) for question generation and evaluation",
        "Memory service for pattern recognition across interviews",
        "Monaco editor integration for coding interviews",
        "Type-safe stack with tRPC, Prisma, and TypeScript",
        "Redis caching for performance"
      ],
    },
    {
      slug: "ai-cost-usage-insight",
      name: "AI Cost Usage Insight",
      tagline: "Finance-first AI cost intelligence platform",
      description:
        "A comprehensive SaaS platform providing real-time visibility into AI usage costs across multiple providers. Helps engineering and finance teams track spending, identify anomalies, forecast future spend, and receive proactive alerts—all without storing prompts or responses.",
      category: "SaaS",
      targetAudience: "Engineering and finance teams using AI",
      githubUrl: "https://github.com/nishchal27/ai-cost-usage-insight-saas",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "BullMQ", "Redis", "Clerk", "Resend"],
      keyFeatures: [
        "Metadata-only ingestion (zero-trust, no prompts/responses stored)",
        "Multi-dimensional cost breakdowns (provider, model, project, feature)",
        "Automated insights (cost concentration, high-growth spend, inefficient usage)",
        "Proactive alerting (budget thresholds, cost spikes, forecast overruns)",
        "30-day forecasting with confidence bands",
        "Optional provider API integration (OpenAI implemented)"
      ],
      problem: "Teams struggle to understand and control AI spending across multiple providers, with limited visibility into costs and optimization opportunities.",
      solution: "A finance-first platform that provides comprehensive cost visibility and actionable insights without compromising data privacy.",
      engineeringHighlights: [
        "Five core engines: Ingestion, Aggregation, Insight, Alerting, Forecasting",
        "Append-only data model for historical integrity",
        "Source-agnostic aggregation (metadata or API)",
        "Background job processing with BullMQ",
        "Deterministic, rule-based insights (explainable and testable)",
        "Idempotent operations for alerts and jobs"
      ],
    },
    {
      slug: "challenge-manager",
      name: "Challenge Manager",
      tagline: "React Native Android app for structured challenge & habit management",
      description:
        "A production-ready React Native Android application for managing structured challenges with participant tracking, automated reminders, and comprehensive analytics. Built for organizers who run time-bound challenges and need professional tools.",
      category: "Mobile",
      targetAudience: "Challenge organizers (meditation teachers, fitness trainers, course creators)",
      githubUrl: "https://github.com/nishchal27/challenge-manager-app",
      technologies: ["React Native", "TypeScript", "Firebase", "Stripe", "Zustand", "React Navigation"],
      keyFeatures: [
        "Complete challenge management (create, edit, lifecycle control)",
        "Participant tracking with engagement metrics",
        "Automated WhatsApp reminders",
        "Organizer dashboard with real-time analytics",
        "Achievement system with gamification",
        "Stripe integration for paid challenges",
        "Subscription management (Free + Premium tiers)"
      ],
      problem: "Organizers need professional tools to manage challenges, track participant engagement, and maintain automation—all while keeping the experience simple for participants.",
      solution: "An organizer-first platform that balances powerful features with intuitive design, providing automation and visibility without complexity.",
      engineeringHighlights: [
        "Psychology-backed design system with 60fps animations",
        "Firebase real-time architecture with Firestore",
        "Stripe React Native SDK integration",
        "Zustand for lightweight state management",
        "Dark mode support with system preference",
        "Accessibility compliance (WCAG AA)",
        "Cloud Functions ready for WhatsApp automation"
      ],
    },
    {
      slug: "pss-mumbai",
      name: "PSS Mumbai",
      tagline: "Public-facing website + admin dashboard for charity/NGO",
      description:
        "A sophisticated public-facing website with admin dashboard for PSS Mumbai, a charity/NGO organization. Features AI-assisted content related to meditation, lifestyle, and vegetarianism, with comprehensive content management capabilities.",
      category: "Web",
      targetAudience: "Public visitors and NGO administrators",
      liveUrl: "https://www.pssmumbai.org",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "AI APIs"],
      keyFeatures: [
        "Public-facing website with modern design",
        "Admin dashboard for content management",
        "AI-assisted content generation",
        "Content related to meditation, lifestyle, vegetarianism",
        "Responsive and accessible design"
      ],
      problem: "NGOs need professional websites with easy content management and the ability to create engaging, informative content for their mission.",
      solution: "A complete web platform combining public-facing presentation with powerful admin tools and AI-assisted content creation.",
      engineeringHighlights: [
        "Modern Next.js architecture",
        "Admin dashboard with content management",
        "AI integration for content assistance",
        "Responsive design for all devices",
        "Clean, maintainable codebase"
      ],
    },
  ] as Project[],
  contact: {
    email: "your.email@example.com",
  },
};
