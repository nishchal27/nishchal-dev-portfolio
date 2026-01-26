# Intervya

**AI-Powered Interview Practice SaaS Platform with Deep Problem-Solving Insights**

Intervya is a production SaaS platform that helps frontend and backend engineers prepare for technical interviews through realistic practice and actionable insights. Unlike question banks or chat apps, Intervya tracks how you approach problems, identifies patterns in your problem-solving style, and provides comprehensive feedback to help you improve over time.

**🚀 [Try Intervya](https://intervya.com)** | **📊 [View Pricing](#-pricing-plans)** | **📖 [Documentation](#-documentation)**

---

## 💼 SaaS Product Overview

Intervya is a **commercial SaaS product** designed for:
- **Job seekers** preparing for technical interviews
- **Engineers** looking to improve their problem-solving skills
- **Bootcamps & training companies** providing interview preparation
- **HR teams** seeking better-prepared candidates

### Why Choose Intervya?

- ✅ **Realistic Interview Simulation** - Practice in an environment that mirrors real technical interviews
- ✅ **AI-Powered Assessment** - Get consistent, structured feedback powered by GPT-4 Turbo
- ✅ **Pattern Recognition** - Understand your problem-solving approach and identify repeated mistakes
- ✅ **Progress Tracking** - See your improvement over time with detailed analytics
- ✅ **Affordable Pricing** - Starting at $0/month with a free tier, Pro at $29/month

---

## 🎯 What Makes Intervya Different

### For Candidates & Engineers

Intervya is **not** just another question bank or AI chat app. It's a realistic interview simulator that:

- **Tracks Your Problem-Solving Patterns**: Understand how you approach problems—do you jump to code, ask clarifying questions, or think methodically?
- **Identifies Repeated Mistakes**: See which mistakes you make repeatedly across interviews, so you know exactly what to focus on
- **Shows Your Progress**: Compare your first interview with your latest to see exactly how you've improved (or where you need work)
- **Provides Behavioral Insights**: Discover your dominant approach style (methodical, rushed, exploratory, uncertain) and behavioral patterns
- **Delivers Honest Feedback**: Get structured, specific feedback that tells you what went wrong and what to improve—no generic praise

### For Recruiters & HR Teams

Intervya helps candidates prepare more effectively by:

- **Realistic Interview Simulation**: Candidates practice in an environment that closely mirrors real technical interviews
- **Comprehensive Assessment**: Evaluates problem-solving, communication, and code quality with consistent, structured feedback
- **Progress Tracking**: Candidates can see their improvement over time, building confidence before real interviews
- **Pattern Recognition**: Identifies recurring weaknesses and strengths, helping candidates focus their preparation

---

## ✨ Key Features

### 1. **Realistic Interview Experience**
- **Two Interview Modes**: Coding (with Monaco editor) and Theory (conceptual questions)
- **Role-Specific**: Practice for Frontend or Backend positions
- **Round-Based Structure**: Warm-up → Core Question → Follow-ups
- **Time Pressure**: Real-time timer that simulates interview pressure
- **Context-Aware Questions**: AI generates questions based on role, mode, and difficulty

### 2. **Problem-Solving Pattern Tracking** 🧠
Intervya observes and tracks how you approach problems:

- **Behavioral Patterns**: Tracks whether you ask clarifying questions, think aloud, consider edge cases, validate assumptions, or jump to code
- **Approach Style Analysis**: Identifies your dominant style (methodical, rushed, exploratory, uncertain)
- **Pattern Visualization**: See percentages and frequencies of your behavioral patterns across all interviews

### 3. **Comprehensive Assessment & Evaluation**
Every interview is evaluated across multiple dimensions:

- **Problem Solving** (0-10): How well you understood and approached the problem
- **Communication** (0-10): Clarity of explanation and thought process
- **Code Quality** (0-10): Readability, structure, and best practices (for coding interviews)
- **Specific Mistakes**: Detailed list of what went wrong
- **Strengths**: What you did well
- **Actionable Improvements**: Concrete steps to improve next time

### 4. **Progress Tracking & Comparison**
See your journey from first interview to latest:

- **Score Progression**: Visual timeline showing your scores across all interviews
- **First vs. Last Comparison**: Side-by-side comparison of your first and most recent interview
- **Trend Analysis**: See which skills improved, declined, or stayed stable
- **What Improved vs. What Didn't**: Clear breakdown showing exactly which areas got better and which need work

### 5. **Repeated Mistakes Identification**
- **Mistake Frequency Tracking**: See which mistakes you've made multiple times
- **Severity Classification**: High, medium, or low severity based on frequency
- **Context Awareness**: Know which interview types (coding/theory, frontend/backend) reveal these mistakes
- **Focus Areas**: Prioritize what to practice based on repeated mistakes

### 6. **Skill Evolution Timeline**
- **Mastery Level Tracking**: Beginner, Intermediate, or Advanced based on your performance
- **Skill Profile**: Strengths and weaknesses identified from your interview history
- **Learning Path Recommendations**: Personalized suggestions on what to practice next
- **Adaptive Difficulty**: System suggests appropriate difficulty based on your performance

### 7. **Memory & Intelligence System**
Intervya remembers your performance across interviews:

- **Evaluation History**: Stores all your evaluations for pattern analysis
- **Skill Profiles**: Builds a comprehensive profile of your strengths and weaknesses
- **Adaptive Follow-ups**: Questions adapt based on your past performance and identified weaknesses
- **Personalized Suggestions**: Recommendations tailored to your specific needs

---

## 🏗️ Architecture

Intervya is built with a clean, maintainable architecture:

### Core Layers

**Phase A — Interview Simulator (Authoritative)**
- **Interview Runtime**: Deterministic state machine that controls interview flow
- **UI Components**: Separate, mode-specific interfaces for Coding and Theory
- **Round Management**: Automatic progression through interview rounds
- **Timer System**: Real-time countdown with pressure mechanics

**Phase B — Intelligent Interview System**
- **Interview Brain**: Unified AI interface (single entry point)
- **Question Engine**: Generates context-aware questions
- **Follow-up Engine**: Intelligent follow-up questions based on your answers
- **Answer Analysis Engine**: Evaluates answers and tracks behavioral patterns
- **Evaluation Engine**: Generates structured, consistent feedback

**Phase C — Memory & Insights System**
- **Memory Service**: Stores evaluation history and builds skill profiles
- **Progress Service**: Tracks trends and calculates improvement rates
- **Pattern Recognition**: Identifies recurring mistakes and behavioral patterns
- **Adaptive Service**: Suggests difficulty and focus areas based on performance

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** (App Router) - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management and caching

### Development Tools
- **Monaco Editor** - VS Code editor for coding interviews
- **Prisma** - Type-safe database ORM
- **Zod** - Schema validation

### Infrastructure
- **Clerk** - Authentication and user management
- **PostgreSQL (Supabase)** - Primary database
- **Redis (Upstash)** - Caching and session storage
- **OpenAI GPT-4 Turbo** - AI-powered question generation and evaluation
- **Stripe** - Payment processing
- **Resend** - Email delivery
- **Vercel** - Hosting and deployment

---

## 🚀 Getting Started

> **Note for End Users**: If you're looking to use Intervya for interview practice, visit [intervya.com](https://intervya.com) to sign up. The instructions below are for developers who want to run their own instance.

### For End Users

**Want to practice interviews?** Visit [intervya.com](https://intervya.com) to:
- Sign up for a free account (3 interviews/month)
- Start practicing immediately
- Upgrade to Pro for unlimited interviews

### For Developers (Self-Hosting)

This section is for developers who want to run their own instance of Intervya.

#### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Redis instance (Upstash recommended for production)
- OpenAI API key
- Clerk account (for authentication)
- Stripe account (for payments, optional for development)

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intervya-realism
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in all required values. See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

### Production Build

```bash
npm run build
npm start
```

---

## 📖 How to Use Intervya

### For End Users (Using the SaaS Platform)

1. **Sign Up & Start**
   - Visit [intervya.com](https://intervya.com) and create a free account
   - Choose your **Role** (Frontend or Backend)
   - Select **Mode** (Coding or Theory)
   - Pick **Difficulty** (Easy or Medium)
   - Click **Start Interview**

2. **Complete the Interview**
   - **Coding Mode**: Write code in the Monaco editor, select your language, test with "Run", then submit
   - **Theory Mode**: Type your explanation clearly and submit
   - Answer follow-up questions in each round

3. **Review Your Feedback**
   - See your scores across all dimensions (Problem Solving, Communication, Code Quality)
   - Read specific mistakes and strengths
   - Get actionable improvement suggestions
   - View behavioral pattern analysis

4. **Track Your Progress**
   - Visit the Dashboard to see:
     - Your progress over time with score progression
     - Behavioral patterns and approach style analysis
     - Repeated mistakes identification
     - Comparison between first and latest interview
     - Skill evolution timeline
     - Personalized learning path recommendations

5. **Upgrade for More**
   - Free tier: 3 interviews/month
   - Pro tier ($29/month): Unlimited interviews + advanced features
   - [View Pricing](https://intervya.com/pricing)

### For Developers (Self-Hosting)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation and development setup.

---

## 📊 Project Structure

```
intervya-realism/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── interview-brain/      # AI interview system
│   │   ├── interviews/           # Interview management
│   │   ├── memory/               # Memory & insights
│   │   ├── progress/             # Progress tracking
│   │   └── stripe/               # Payment processing
│   ├── dashboard/                # User dashboard
│   ├── interviews/               # Interview pages
│   └── pricing/                  # Pricing page
├── components/                    # React components
│   ├── modes/                     # Mode-specific UIs
│   │   ├── coding-mode.tsx
│   │   └── theory-mode.tsx
│   ├── progress-dashboard.tsx     # Progress overview
│   ├── interview-comparison.tsx  # Comparison view
│   ├── behavioral-patterns.tsx   # Pattern visualization
│   └── learning-path.tsx         # Recommendations
├── lib/
│   ├── interview-runtime/         # Core runtime (authoritative)
│   ├── interview-brain/           # AI intelligence layer
│   ├── services/                  # Business logic
│   │   ├── memory.service.ts      # Memory & patterns
│   │   ├── progress.service.ts    # Progress tracking
│   │   └── adaptive.service.ts    # Adaptive recommendations
│   └── db/                        # Database client
├── hooks/                         # React hooks
│   └── queries/                   # TanStack Query hooks
└── store/                         # Zustand state
```

---

## 🎯 Success Metrics

Intervya succeeds when users can say:

- ✅ "I can see my progress over time"
- ✅ "I understand how I approach problems"
- ✅ "I know what mistakes I repeat"
- ✅ "I can see what improved and what didn't"
- ✅ "I can compare my first interview with my latest"
- ✅ "I trust the feedback I receive"

---

## ✅ Current Status

### Production-Ready Features

**Interview System:**
- ✅ Realistic interview simulator with round-based flow
- ✅ Separate Coding and Theory modes
- ✅ AI-powered question generation
- ✅ Intelligent follow-up questions
- ✅ Structured feedback with behavioral pattern tracking

**Insights & Analytics:**
- ✅ Progress tracking and trend analysis
- ✅ Behavioral pattern identification
- ✅ Repeated mistakes detection
- ✅ Interview comparison (first vs. latest)
- ✅ Skill evolution timeline
- ✅ Learning path recommendations

**Infrastructure:**
- ✅ User authentication (Clerk)
- ✅ Database (PostgreSQL + Prisma)
- ✅ Caching (Redis)
- ✅ Payment processing (Stripe)
- ✅ Email delivery (Resend)
- ✅ Production-ready deployment setup

---

## 🔒 Feedback Consistency

Intervya ensures feedback consistency through:

- **Structured Evaluation**: Consistent scoring criteria across all interviews
- **Feedback Locking**: Once generated, feedback is locked and won't change
- **Pattern-Based Analysis**: Uses historical data to ensure comparable evaluations
- **Low Temperature AI**: Uses temperature 0.3 for consistent AI responses

---

## 💰 Pricing Plans

Intervya offers flexible pricing to suit different needs:

### Free Tier
- **Price**: $0/month (forever)
- **Features**:
  - 3 interviews per month
  - Basic feedback and progress tracking
  - Email support
- **Perfect for**: Trying out the platform, occasional practice

### Pro Tier
- **Price**: $29/month
- **Features**:
  - Unlimited interviews
  - Advanced AI feedback with behavioral pattern analysis
  - Detailed analytics and progress insights
  - Priority support
  - Weekly progress reports
  - Custom interview settings
- **Perfect for**: Active job seekers, serious interview preparation

### Enterprise Tier
- **Price**: Custom pricing
- **Features**:
  - Everything in Pro
  - Team collaboration features
  - Custom integrations
  - Dedicated support with SLA
  - Custom training and onboarding
- **Perfect for**: Bootcamps, training companies, enterprises

**👉 [View Full Pricing Details](https://intervya.com/pricing)**

---

## 🎯 Target Market

### Primary Users
- **Software Engineers** preparing for technical interviews (Frontend/Backend)
- **Job Seekers** looking to improve interview performance
- **Career Changers** transitioning into software engineering roles

### Secondary Users
- **Bootcamps & Training Companies** providing interview preparation services
- **HR Teams** seeking better-prepared candidates
- **Educational Institutions** teaching interview skills

---

## 📚 Documentation

### For Users
- [Getting Started Guide](#-how-to-use) - How to use Intervya
- [Feature Overview](#-key-features) - Complete feature list

### For Developers
- [Environment Setup Guide](./ENV_SETUP.md) - Detailed setup instructions
- [Architecture Documentation](./ARCHITECTURE.md) - System architecture
- [Soul Engineering Analysis](./SOUL_ENGINEERING_ANALYSIS.md) - Core identity and philosophy

---

## 🔐 Security & Privacy

- **Secure Authentication**: Powered by Clerk with industry-standard security
- **Data Privacy**: Your interview data is encrypted and stored securely
- **GDPR Compliant**: We respect your privacy and data rights
- **Payment Security**: Stripe handles all payments with PCI-DSS compliance

---

## 📞 Support & Contact

- **Email Support**: Available for all users
- **Priority Support**: Included in Pro and Enterprise plans
- **Documentation**: Comprehensive guides and FAQs
- **Community**: Join our community for tips and best practices

---

## 🤝 For Developers

This is a **production SaaS application**. The codebase is private and proprietary.

**Interested in contributing or have questions?**
- Review the [Architecture Documentation](./ARCHITECTURE.md)
- Check the [Environment Setup Guide](./ENV_SETUP.md)
- Contact the maintainers for collaboration opportunities

---

## 📝 License

**Private - All rights reserved**

This is proprietary software. Unauthorized use, copying, or distribution is prohibited.

---

## 🌟 Built for Engineers, by Engineers

Intervya is built with ❤️ for engineers who want to improve their interview skills through realistic practice and actionable insights. We believe that understanding how you approach problems is just as important as getting the right answer.

**Ready to improve your interview skills?** [Get Started](https://intervya.com) today!
