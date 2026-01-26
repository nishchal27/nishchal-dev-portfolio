// API route for AI-powered architecture planning

import { NextRequest, NextResponse } from "next/server";
import { serverRateLimiter, getClientIP } from "@/lib/server/rate-limit";
import { sessionManager } from "@/lib/server/session";
import { aiClient } from "@/lib/ai/client";
import {
  architectureRequestSchema,
  validatePrompt,
  sanitizeInput,
} from "@/lib/ai/validation";
import { buildArchitecturePrompt } from "@/lib/ai/prompts";

export const maxDuration = 30; // 30 seconds max for AI calls

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
    const validationResult = architectureRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return NextResponse.json(
        {
          error: "Invalid request",
          message: errorMessages.join("; "),
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { appIdea, constraints, sessionId, provider = "openai" } =
      validationResult.data;

    // Validate and sanitize input
    const sanitized = sanitizeInput(appIdea);
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
      currentSessionId = sessionManager.createSession({ constraints });
    } else {
      const session = sessionManager.getSession(currentSessionId);
      if (!session) {
        currentSessionId = sessionManager.createSession({ constraints });
      }
    }

    // Add user message to session
    sessionManager.addMessage(currentSessionId, "user", sanitized);

    // Get session history for context
    const sessionHistory = sessionManager.getMessages(currentSessionId);

    // Build prompt
    const prompt = buildArchitecturePrompt({
      userInput: sanitized,
      sessionHistory: sessionHistory
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      metadata: { constraints },
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
      "You are an expert software architect. Always respond with valid JSON. Be specific about technologies, patterns, and real-world considerations.";

    const response = await aiClient.generate(prompt, provider, systemPrompt);

    // Parse JSON response
    let parsedResponse;
    try {
      // Try to extract JSON from response (AI might wrap it in markdown)
      const jsonMatch = response.content.match(/```json\s*([\s\S]*?)\s*```/) ||
        response.content.match(/```\s*([\s\S]*?)\s*```/) ||
        [null, response.content];
      parsedResponse = JSON.parse(jsonMatch[1] || jsonMatch[0] || response.content);
    } catch (parseError) {
      // If JSON parsing fails, return the raw response with a warning
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
    console.error("Architecture planning error:", error);

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
