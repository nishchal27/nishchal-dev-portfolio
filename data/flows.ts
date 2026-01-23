export interface FlowStep {
  id: string;
  title: string;
  description: string;
  component?: string;
  edgeCases?: string[];
  failureHandling?: string;
}

export interface FlowData {
  slug: string;
  title: string;
  description: string;
  steps: FlowStep[];
  edgeCases: string[];
  failureRecovery: string;
}

export const flows: FlowData[] = [
  {
    slug: "credit-purchase",
    title: "Credit Purchase & Top-Up Flow",
    description:
      "End-to-end flow for purchasing credits in a SaaS application, from checkout initiation to credit balance update.",
    steps: [
      {
        id: "1",
        title: "User Initiates Purchase",
        description:
          "User selects credit package and clicks purchase. Frontend creates purchase intent with idempotency key.",
        component: "Frontend",
        edgeCases: [
          "User clicks multiple times",
          "Network failure during request",
          "Invalid credit package selection",
        ],
        failureHandling:
          "Idempotency key prevents duplicate charges. Frontend shows loading state and disables button during request.",
      },
      {
        id: "2",
        title: "Create Stripe Checkout Session",
        description:
          "Backend creates Stripe Checkout session with metadata (user ID, credit amount, idempotency key).",
        component: "Payment API",
        edgeCases: [
          "Stripe API timeout",
          "Invalid user ID",
          "Stripe account issues",
        ],
        failureHandling:
          "Retry with exponential backoff. Return clear error to user. Log failure for investigation.",
      },
      {
        id: "3",
        title: "Redirect to Stripe Checkout",
        description:
          "User is redirected to Stripe-hosted checkout page. Session stored in database with status 'pending'.",
        component: "Stripe Checkout",
        edgeCases: [
          "User abandons checkout",
          "Browser back button",
          "Checkout session expires",
        ],
        failureHandling:
          "Expired sessions are cleaned up by background job. User can initiate new purchase.",
      },
      {
        id: "4",
        title: "Payment Success",
        description:
          "User completes payment on Stripe. Stripe processes payment and triggers webhook.",
        component: "Stripe",
        edgeCases: [
          "Payment method declined",
          "Insufficient funds",
          "Card expired",
        ],
        failureHandling:
          "Stripe handles payment failures. User sees error and can retry with different payment method.",
      },
      {
        id: "5",
        title: "Webhook Received",
        description:
          "Stripe sends webhook event (checkout.session.completed). Webhook handler verifies signature.",
        component: "Webhook Handler",
        edgeCases: [
          "Webhook replay (duplicate event)",
          "Invalid signature",
          "Out of order events",
        ],
        failureHandling:
          "Verify Stripe signature. Check event ID against processed events table to prevent duplicates.",
      },
      {
        id: "6",
        title: "Process Webhook",
        description:
          "Extract purchase details from webhook. Validate idempotency key. Begin database transaction.",
        component: "Webhook Processor",
        edgeCases: [
          "Idempotency key already processed",
          "Invalid webhook data",
          "Database transaction fails",
        ],
        failureHandling:
          "If idempotency key exists, return success (idempotent). Validate all data before processing. Use DB transactions.",
      },
      {
        id: "7",
        title: "Update Credit Balance",
        description:
          "Add credits to user balance atomically. Log transaction. Invalidate cache. Send confirmation email.",
        component: "Credit Service",
        edgeCases: [
          "User account deleted",
          "Credit amount mismatch",
          "Cache invalidation fails",
        ],
        failureHandling:
          "Transaction ensures atomicity. If user deleted, refund via Stripe. Cache invalidation is best-effort (will refresh on next read).",
      },
      {
        id: "8",
        title: "Confirmation",
        description:
          "User redirected back to app. Credit balance updated. Confirmation email sent.",
        component: "Frontend + Email Service",
        edgeCases: [
          "Email delivery failure",
          "User doesn't return to app",
          "Session expired",
        ],
        failureHandling:
          "Show confirmation in-app regardless. Retry email delivery. User can check balance manually.",
      },
    ],
    edgeCases: [
      "Webhook arrives before user returns to app",
      "Payment succeeds but webhook never arrives (polling fallback)",
      "Partial refunds after credit usage",
      "Chargeback handling",
    ],
    failureRecovery:
      "Webhook is source of truth. If webhook delayed, poll Stripe API for session status. All operations are idempotent. Failed payments don't affect credit balance. Support can manually adjust if needed.",
  },
  {
    slug: "ai-request",
    title: "AI Request with Credit Deduction",
    description:
      "Complete flow for processing an AI generation request, including credit check, deduction, and response delivery.",
    steps: [
      {
        id: "1",
        title: "User Submits Request",
        description:
          "User submits AI generation request (text or image). Frontend validates input and sends to API.",
        component: "Frontend",
        edgeCases: [
          "Invalid input",
          "Request too large",
          "Rate limit exceeded",
        ],
        failureHandling: "Validate on frontend and backend. Return clear errors. Rate limit with clear messaging.",
      },
      {
        id: "2",
        title: "Authenticate & Check Rate Limit",
        description:
          "Verify user session. Check rate limit using Redis sliding window (requests per minute).",
        component: "API Middleware",
        edgeCases: [
          "Redis unavailable",
          "Rate limit exceeded",
          "Concurrent requests",
        ],
        failureHandling:
          "If Redis down, allow request but log. Use distributed locks for concurrent rate limit checks.",
      },
      {
        id: "3",
        title: "Check Credit Balance",
        description:
          "Query database for user credit balance. Use row-level lock to prevent race conditions.",
        component: "Credit Service",
        edgeCases: [
          "Insufficient credits",
          "Balance changed during request",
          "Negative balance (race condition)",
        ],
        failureHandling:
          "Use SELECT FOR UPDATE to lock row. Return clear error if insufficient. Prevent negative balances.",
      },
      {
        id: "4",
        title: "Estimate Token Cost",
        description:
          "Estimate tokens needed for request (prompt length + estimated response). Calculate credit cost.",
        component: "Token Calculator",
        edgeCases: [
          "Token estimation inaccurate",
          "Model pricing changed",
          "Very long responses",
        ],
        failureHandling:
          "Use conservative estimates. Charge based on actual usage after completion. Handle pricing changes gracefully.",
      },
      {
        id: "5",
        title: "Reserve Credits",
        description:
          "Reserve estimated credits in database (status: 'reserved'). Prevents overspending during processing.",
        component: "Credit Service",
        edgeCases: [
          "Reservation fails",
          "Concurrent reservations",
          "Reservation timeout",
        ],
        failureHandling:
          "Use optimistic locking. Timeout reservations after 5 minutes, release credits automatically.",
      },
      {
        id: "6",
        title: "Call AI Provider",
        description:
          "Call LLM provider (OpenAI, Anthropic) with request. Stream response if supported.",
        component: "AI Service",
        edgeCases: [
          "AI API timeout",
          "AI API error",
          "Stream interruption",
        ],
        failureHandling:
          "Retry with exponential backoff (max 3 retries). If fails, release reserved credits. Return error to user.",
      },
      {
        id: "7",
        title: "Calculate Actual Cost",
        description:
          "Count actual tokens used (prompt + response). Calculate final credit cost.",
        component: "Token Tracker",
        edgeCases: [
          "Token counting fails",
          "Cost exceeds reservation",
          "Cost less than reservation",
        ],
        failureHandling:
          "Adjust credit deduction. If exceeds reservation, check balance again or charge difference. Refund excess if under.",
      },
      {
        id: "8",
        title: "Deduct Credits",
        description:
          "Deduct actual cost from balance. Update reservation to 'completed'. Invalidate cache.",
        component: "Credit Service",
        edgeCases: [
          "Deduction fails",
          "Balance goes negative",
          "Transaction rollback",
        ],
        failureHandling:
          "Use database transaction. If balance insufficient, mark as failed, don't deduct. Log for investigation.",
      },
      {
        id: "9",
        title: "Return Response",
        description:
          "Return AI response to user. Include remaining credit balance in response headers.",
        component: "API Response",
        edgeCases: [
          "Response too large",
          "Streaming failure",
          "User disconnects",
        ],
        failureHandling:
          "Chunk large responses. Fallback to non-streaming if streaming fails. Credits still deducted if request processed.",
      },
    ],
    edgeCases: [
      "User makes multiple concurrent requests",
      "Credits deducted but request fails",
      "Request succeeds but credits not deducted",
      "Rate limit and credit check race condition",
    ],
    failureRecovery:
      "All credit operations are transactional. Failed requests release reserved credits. Background job reconciles discrepancies. User can view credit history and transaction log.",
  },
  {
    slug: "vector-search",
    title: "Vector Search & Content Filtering",
    description:
      "Flow for semantic search using vector embeddings, from query to filtered results.",
    steps: [
      {
        id: "1",
        title: "User Submits Search Query",
        description:
          "User enters search query. Frontend sends to search API endpoint.",
        component: "Frontend",
        edgeCases: [
          "Empty query",
          "Very long query",
          "Special characters",
        ],
        failureHandling: "Validate and sanitize input. Return helpful errors.",
      },
      {
        id: "2",
        title: "Generate Query Embedding",
        description:
          "Convert search query to vector embedding using same model as content embeddings.",
        component: "Embedding Service",
        edgeCases: [
          "Embedding API failure",
          "Dimension mismatch",
          "Timeout",
        ],
        failureHandling:
          "Retry embedding generation. Fallback to keyword search if embedding fails.",
      },
      {
        id: "3",
        title: "Vector Similarity Search",
        description:
          "Query vector database for similar embeddings. Return top K results with similarity scores.",
        component: "Vector DB",
        edgeCases: [
          "No results found",
          "Vector DB timeout",
          "Index not built",
        ],
        failureHandling:
          "Return empty results gracefully. Log timeouts. Ensure index is built before going live.",
      },
      {
        id: "4",
        title: "Filter & Rank Results",
        description:
          "Apply additional filters (date, category). Re-rank based on relevance and metadata.",
        component: "Search Service",
        edgeCases: [
          "Filters too restrictive (no results)",
          "Ranking algorithm issues",
        ],
        failureHandling:
          "Relax filters if no results. Use fallback ranking if primary fails.",
      },
      {
        id: "5",
        title: "Return Results",
        description:
          "Return filtered and ranked results to user. Include metadata and similarity scores.",
        component: "API Response",
        edgeCases: [
          "Results format mismatch",
          "Missing metadata",
        ],
        failureHandling:
          "Validate result format. Include default values for missing metadata.",
      },
    ],
    edgeCases: [
      "Embedding model version mismatch",
      "Vector DB index corruption",
      "Very large result sets",
    ],
    failureRecovery:
      "Version embeddings with model version. Monitor index health. Paginate large result sets. Fallback to keyword search if vector search fails.",
  },
];
