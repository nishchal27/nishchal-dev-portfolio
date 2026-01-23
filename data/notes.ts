export interface EngineeringNote {
  slug: string;
  title: string;
  category: "design-decisions" | "mistakes" | "reflections";
  date: string;
  excerpt: string;
  content: string;
}

export const notes: EngineeringNote[] = [
  {
    slug: "choosing-server-actions",
    title: "Choosing Server Actions for Internal Operations",
    category: "design-decisions",
    date: "2024-01-15",
    excerpt:
      "Why I chose Server Actions over API Routes for credit operations in AuthorAI, and when I still use API Routes.",
    content: `When building AuthorAI's credit system, I had to decide between Next.js Server Actions and traditional API Routes.

**Why Server Actions:**
- End-to-end type safety without manual type definitions
- Less boilerplate for simple mutations
- Better integration with React Server Components
- Simpler mental model for form submissions

**When I Still Use API Routes:**
- Stripe webhook handlers (need standard HTTP interface)
- Public APIs that external services might call
- Complex middleware requirements

**Decision:** Used Server Actions for internal credit operations (deduction, balance checks) and API Routes for Stripe webhooks. This gave us type safety where it matters most while maintaining flexibility for external integrations.

**What I'd change:** Nothing yet. The hybrid approach works well. Server Actions handle 80% of our internal operations, and API Routes handle the edge cases where we need HTTP flexibility.`,
  },
  {
    slug: "credit-race-condition",
    title: "Credit Deduction Race Condition",
    category: "mistakes",
    date: "2024-01-20",
    excerpt:
      "How I introduced and fixed a race condition in the credit deduction system that allowed negative balances.",
    content: `I initially implemented credit deduction without proper locking, which led to race conditions.

**The Problem:**
- User makes multiple concurrent AI requests
- Each request checks balance and deducts credits
- Without locking, both could read same balance and both deduct
- Result: Negative credit balance

**The Fix:**
- Used PostgreSQL row-level locking (SELECT FOR UPDATE)
- Wrapped credit check and deduction in a transaction
- Added database constraint to prevent negative balances
- Implemented optimistic locking for high concurrency

**Lesson Learned:**
Financial operations require ACID transactions and proper locking. Don't assume "it probably won't happen" - concurrent requests are common in production.

**What I'd change:** I should have implemented locking from the start. The fix was straightforward, but it required a migration and careful testing to ensure no edge cases.`,
  },
  {
    slug: "ai-cost-optimization",
    title: "AI Cost Optimization Journey",
    category: "reflections",
    date: "2024-01-25",
    excerpt:
      "How I reduced AI API costs by 60% through caching, prompt optimization, and smart model selection.",
    content: `When AuthorAI first launched, AI API costs were eating into margins. Here's how I optimized.

**Initial State:**
- No caching (every request hit the API)
- Long, verbose prompts
- Always using GPT-4 for everything
- Cost: ~$0.15 per content generation

**Optimization Strategies:**

1. **Response Caching**
   - Cache common content generation patterns
   - Cache key based on prompt hash
   - Result: 40% of requests served from cache

2. **Prompt Optimization**
   - Reduced prompt length by 30% through iteration
   - Removed redundant instructions
   - Used system messages more effectively
   - Result: 30% token reduction per request

3. **Model Selection**
   - GPT-3.5 for simple tasks (summaries, basic content)
   - GPT-4 for complex tasks (SEO optimization, creative writing)
   - Result: 50% cost reduction on simple tasks

**Final State:**
- Cost: ~$0.06 per content generation (60% reduction)
- Quality maintained through careful testing
- Users see faster responses (cached requests)

**What I'd change:** I wish I had implemented caching from day one. The prompt optimization took time but was worth it. Model selection requires ongoing monitoring to ensure quality doesn't degrade.`,
  },
  {
    slug: "stripe-webhook-idempotency",
    title: "Stripe Webhook Idempotency",
    category: "design-decisions",
    date: "2024-02-01",
    excerpt:
      "Implementing idempotent webhook processing to handle duplicate events and ensure credit balance accuracy.",
    content: `Stripe webhooks can be delivered multiple times. Processing them without idempotency can lead to duplicate credit additions.

**The Problem:**
- Stripe may retry webhook delivery
- Network issues can cause duplicate events
- Processing same event twice = double credit addition

**The Solution:**
- Store processed event IDs in database
- Check event ID before processing
- If event already processed, return success (idempotent)
- Use database unique constraint on event ID

**Implementation:**
\`\`\`
1. Receive webhook
2. Verify Stripe signature
3. Check if event_id exists in processed_events table
4. If exists, return 200 (already processed)
5. If not, process event and insert event_id
6. Return 200
\`\`\`

**Result:**
- Zero duplicate credit additions
- Handles webhook retries gracefully
- Simple and reliable

**What I'd change:** Nothing. This pattern works well and is standard for webhook processing. The key is checking idempotency before any side effects.`,
  },
  {
    slug: "vector-search-implementation",
    title: "Implementing Vector Search for Content",
    category: "design-decisions",
    date: "2024-02-05",
    excerpt:
      "Adding semantic search to AuthorAI using vector embeddings, and the tradeoffs involved.",
    content: `I added vector search to enable semantic content discovery in AuthorAI.

**Why Vector Search:**
- Keyword search misses semantic relationships
- Users search by intent, not exact keywords
- Better user experience for content discovery

**Implementation:**
- Generate embeddings for all content using OpenAI embeddings API
- Store in vector database (Pinecone)
- Query with user search term embedding
- Return top K similar results

**Tradeoffs:**
- Additional infrastructure cost (vector DB)
- Embedding generation adds latency to content creation
- Requires careful index management

**Performance:**
- Search latency: ~200ms (acceptable)
- Index update latency: ~500ms per content item
- Cost: ~$0.0001 per embedding

**What I'd change:** Consider using pgvector (PostgreSQL extension) instead of separate vector DB to reduce infrastructure complexity. However, Pinecone's managed service is easier to scale.`,
  },
  {
    slug: "over-engineering-cache",
    title: "Over-Engineering the Cache Layer",
    category: "mistakes",
    date: "2024-02-10",
    excerpt:
      "I initially built a complex cache invalidation system when simple TTL-based caching would have sufficed.",
    content: `I spent too much time building a "sophisticated" cache invalidation system.

**The Over-Engineering:**
- Event-driven cache invalidation
- Complex dependency graph
- Custom invalidation rules engine
- Real-time cache updates

**The Reality:**
- Most cached data has natural TTL (user sessions: 1 hour, content: 24 hours)
- Event-driven invalidation added complexity without much benefit
- Simple TTL + manual invalidation on critical updates works fine

**What I Changed:**
- Switched to TTL-based caching for most data
- Manual invalidation only for critical updates (credit balance)
- Removed event-driven system
- Much simpler codebase

**Lesson Learned:**
Start simple. Add complexity only when you have a clear, measurable need. TTL-based caching handles 90% of use cases.

**What I'd change:** I should have started with TTL and only added event-driven invalidation if metrics showed it was needed. The simpler system is easier to reason about and maintain.`,
  },
];
