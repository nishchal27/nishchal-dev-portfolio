// API route for interactive system design analysis

import { NextRequest, NextResponse } from "next/server";
import { serverRateLimiter, getClientIP } from "@/lib/server/rate-limit";
import { sessionManager } from "@/lib/server/session";
import { aiClient } from "@/lib/ai/client";
import {
  systemDesignRequestSchema,
  validatePrompt,
  sanitizeInput,
} from "@/lib/ai/validation";
import { buildSystemDesignPrompt } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitCheck = serverRateLimiter.canMakeRequest(ip);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: rateLimitCheck.reason,
          remaining: serverRateLimiter.getRemainingRequests(ip),
        },
        { status: 429 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validationResult = systemDesignRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return NextResponse.json(
        {
          error: "Invalid request",
          message: errorMessages.join("; "),
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { baseArchitecture, changes, sessionId, provider = "openai" } =
      validationResult.data;

    // Validate and sanitize input
    const sanitized = sanitizeInput(baseArchitecture);
    const promptValidation = validatePrompt(sanitized);

    if (!promptValidation.valid) {
      return NextResponse.json(
        {
          error: "Invalid input",
          message: promptValidation.error,
        },
        { status: 400 }
      );
    }

    // Get or create session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = sessionManager.createSession({ changes });
    } else {
      const session = sessionManager.getSession(currentSessionId);
      if (!session) {
        currentSessionId = sessionManager.createSession({ changes });
      }
    }

    // Add user message to session
    const userMessage = `Base architecture: ${sanitized}${
      changes
        ? `\nChanges: ${JSON.stringify(changes, null, 2)}`
        : ""
    }`;
    sessionManager.addMessage(currentSessionId, "user", userMessage);

    // Get session history
    const sessionHistory = sessionManager.getMessages(currentSessionId);

    // Build prompt
    const prompt = buildSystemDesignPrompt({
      userInput: sanitized,
      sessionHistory: sessionHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      metadata: { changes },
    });

    // Check provider availability
    if (!aiClient.isProviderAvailable(provider)) {
      const available = aiClient.getAvailableProviders();
      return NextResponse.json(
        {
          error: "Provider not available",
          message: `Provider '${provider}' is not configured. Available: ${available.join(", ")}`,
          availableProviders: available,
        },
        { status: 400 }
      );
    }

    // Generate response
    const systemPrompt =
      "You are a system design expert analyzing architecture changes. Always respond with valid JSON. Be specific about real-world cost, performance, and complexity implications.";

    const response = await aiClient.generate(prompt, provider, systemPrompt);

    // Parse JSON response
    let parsedResponse;
    try {
      const jsonMatch = response.content.match(/```json\s*([\s\S]*?)\s*```/) ||
        response.content.match(/```\s*([\s\S]*?)\s*```/) ||
        [null, response.content];
      parsedResponse = JSON.parse(jsonMatch[1] || jsonMatch[0] || response.content);
    } catch (parseError) {
      parsedResponse = {
        error: "Failed to parse AI response as JSON",
        rawResponse: response.content,
      };
    }

    // Add assistant message to session
    sessionManager.addMessage(
      currentSessionId,
      "assistant",
      response.content
    );

    return NextResponse.json({
      success: true,
      data: parsedResponse,
      sessionId: currentSessionId,
      tokensUsed: response.tokensUsed,
      provider: response.provider,
      remaining: serverRateLimiter.getRemainingRequests(ip),
    });
  } catch (error) {
    console.error("System design analysis error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
