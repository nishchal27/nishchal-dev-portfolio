# AI Usage & Cost Visibility SaaS

> **Finance-first AI cost intelligence platform** that helps teams understand, control, and forecast AI spend without collecting prompts, responses, or sensitive business data.

[![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](./STATUS.md)

---

## 🎯 What Is This?

A comprehensive SaaS platform that provides **real-time visibility** into AI usage costs across multiple providers (OpenAI, Anthropic, Google, etc.). The platform helps engineering and finance teams:

- **Track spending** across providers, models, projects, and features
- **Identify cost anomalies** and optimization opportunities
- **Forecast future spend** with confidence bands
- **Receive proactive alerts** for budget thresholds, cost spikes, and forecast overruns
- **Make data-driven decisions** with actionable insights

### Key Differentiators

✅ **Metadata-only ingestion** - Zero-trust by default, never stores prompts or responses  
✅ **Source-agnostic** - Works with manual metadata or optional provider API integration  
✅ **Finance-first language** - Built for finance teams, not just engineers  
✅ **Proactive alerting** - Budget thresholds, spike detection, and forecast overruns  
✅ **Rule-based insights** - Deterministic, explainable recommendations  

---

## ✨ Features

### 📊 Cost Visibility
- **Multi-dimensional breakdowns**: By provider, model, project, feature, and API key
- **Time-series analysis**: Daily and monthly aggregations with historical trends
- **Interactive dashboards**: Charts and visualizations powered by Recharts
- **Real-time updates**: Background processing ensures data is always current

### 💡 Intelligent Insights
Four types of automated insights help identify cost optimization opportunities:

1. **Cost Concentration** - Detects when >80% of costs come from a single provider
2. **High-Growth Spend** - Identifies >50% spending increases vs previous periods
3. **Inefficient Model Usage** - Flags expensive models used for simple tasks (>3x cost difference)
4. **Feature-Level Anomalies** - Detects sudden spikes (>100% growth) or new high-cost features

### 🚨 Proactive Alerting
Three types of automated alerts keep teams informed:

1. **Budget Threshold Alerts** - Notifications at 80%, 90%, and 100% of monthly budget
2. **Cost Spike Alerts** - Detects when today's spend exceeds 100% of 7-day average
3. **Forecast Overrun Alerts** - Warns when predicted spend exceeds budget

### 📈 Forecasting
- **30-day predictions** with confidence bands (±20%)
- **Risk assessment** (low/medium/high) based on budget comparison
- **Days until budget exceeded** calculation
- **Trend-based extrapolation** with explainable methodology

### ⚙️ Optional Provider API Integration
- **Read-only API key sync** for automatic data collection
- **Historical backfill** when keys are added
- **Encrypted storage** of API keys
- **Multi-provider support** (OpenAI implemented, others extensible)

---

## 🏗️ Architecture

The platform follows a **product-first, engine-based architecture** with strict separation of concerns.

### Five Core Engines

1. **Ingestion Engine** - Validates, sanitizes, and stores usage events (append-only)
2. **Aggregation Engine** - SQL-based aggregation, source-agnostic (metadata or API)
3. **Insight Engine** - Rule-based heuristics that generate actionable recommendations
4. **Alerting Engine** - Monitors thresholds and dispatches idempotent notifications
5. **Forecasting Engine** - Trend-based predictions with confidence bands

### Data Flow

```
Usage Event → Ingestion → UsageEvent (DB)
                    ↓
            Aggregation Job (Background)
                    ↓
            AggregatedUsage (DB)
                    ↓
            Insight Generation
                    ↓
            Alert Checks → Email Notifications
```

### Key Principles

- **Append-only data model** - Usage events are immutable, ensuring historical integrity
- **Source-agnostic aggregation** - Works with metadata-only or optional API integration
- **Vertical slices** - Features built end-to-end (UI → API → Engine → Storage)
- **Deterministic logic** - Rule-based insights are explainable and testable
- **Idempotent operations** - All alerts and jobs prevent duplicates

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router, React Server Components)
- **UI Library**: ShadCN UI + Radix UI primitives
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Query (server state) + Zustand (client state)
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL (via Prisma ORM)
- **Queue System**: BullMQ + Redis (Upstash recommended)
- **Authentication**: Clerk
- **Email**: Resend
- **Validation**: Zod

### Infrastructure
- **Language**: TypeScript
- **ORM**: Prisma
- **Background Jobs**: BullMQ workers
- **Cron Jobs**: External service (Vercel Cron, GitHub Actions, etc.)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase, Neon, or local)
- Redis instance (Upstash recommended)
- Clerk account (for authentication)
- Resend account (for email)

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in all required variables (see [SETUP.md](./SETUP.md) for details)

3. **Set up database:**
```bash
npm run db:generate
npm run db:push
```

4. **Run development server:**
```bash
npm run dev
```

5. **Run background workers** (in a separate terminal):
```bash
npm run worker
```

6. **Access the application:**
   - Open `http://localhost:3000`
   - Sign up or sign in via Clerk

### Detailed Setup

For comprehensive setup instructions, including environment variable configuration and deployment guidance, see [SETUP.md](./SETUP.md).

---

## 📁 Project Structure

```
src/
  app/                    # Next.js App Router
    (dashboard)/          # Protected dashboard routes
      dashboard/          # Overview page
      costs/              # Cost breakdowns page
      insights/           # Insights page
      forecasts/          # Forecasts page
      alerts/             # Alerts page
      data-sources/       # Data sources explanation
      settings/           # User settings
    (marketing)/          # Public marketing pages
    api/                  # API routes
      ingestion/          # Usage event submission
      usage/              # Aggregated usage data
      insights/           # Insights CRUD
      forecast/           # Forecast data
      alerts/             # Alerts data
      settings/           # User settings
      provider-keys/      # Provider API keys CRUD
      cron/               # Cron job endpoints
  components/             # React components
    dashboard/            # Dashboard-specific components
    pages/                # Page-level components
    layout/               # Layout components
    settings/             # Settings components
    ui/                   # ShadCN UI components
  engines/                # Core business logic engines
    ingestion/            # Event ingestion engine
    aggregation/          # Usage aggregation engine
    insight/              # Insight generation engine
    alerting/             # Alerting engine
    forecasting/          # Forecasting engine
    provider-sync/        # Provider API sync engine
  lib/                    # Utilities & infrastructure
    db.ts                 # Prisma client
    redis.ts              # Redis client
    queue.ts              # BullMQ queues
    email.ts              # Resend email client
    cron.ts               # Cron job definitions
    encryption.ts         # API key encryption
    providers/            # Provider API clients
  workers/                # BullMQ workers
    index.ts              # Worker entry point
  types/                  # TypeScript type definitions
```

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture principles and design decisions
- **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)** - Comprehensive system design documentation
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Complete feature implementation status
- **[STATUS.md](./STATUS.md)** - Current implementation status

---

## 🎯 Current Status

**✅ Production Ready** - All core features are fully implemented and tested.

### Completed Features

- ✅ All 5 core engines (Ingestion, Aggregation, Insight, Alerting, Forecasting)
- ✅ Complete dashboard UI with 7 pages (Overview, Costs, Insights, Forecasts, Alerts, Data Sources, Settings)
- ✅ 4 types of automated insights
- ✅ 3 types of proactive alerts
- ✅ Provider API key integration (OpenAI implemented)
- ✅ Background job processing (5 workers)
- ✅ Email notifications (Resend integration)
- ✅ Authentication and authorization (Clerk)
- ✅ Multi-dimensional cost breakdowns

### Deployment Checklist

Before deploying to production:

- [ ] Configure all environment variables
- [ ] Set up PostgreSQL database
- [ ] Set up Redis instance (Upstash)
- [ ] Configure Clerk application
- [ ] Verify Resend domain and update email `from` address
- [ ] Set up cron jobs for scheduled tasks (see [IMPLEMENTATION.md](./IMPLEMENTATION.md))
- [ ] Deploy Next.js application
- [ ] Deploy background workers (separate process/container)
- [ ] Test end-to-end flow

---

## 🔒 Security & Privacy

- **Metadata-only ingestion** - Never stores prompts, responses, or sensitive content
- **Encrypted API keys** - Provider API keys are encrypted before storage
- **Authentication required** - All routes protected via Clerk middleware
- **HTTPS everywhere** - Secure connections enforced
- **Idempotent operations** - Prevents duplicate alerts and jobs
- **Read-only provider access** - API keys only used for usage data, never content

---

## 🤝 Contributing

This is a production SaaS application. For questions, issues, or contributions, please refer to the project documentation or contact the maintainers.

---

## 📄 License

Private - All rights reserved.

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Clerk](https://clerk.com/) - Authentication
- [BullMQ](https://docs.bullmq.io/) - Job queue
- [ShadCN UI](https://ui.shadcn.com/) - Component library
- [Resend](https://resend.com/) - Email service

---

**Built with ❤️ for teams who want to understand and control their AI costs.**
