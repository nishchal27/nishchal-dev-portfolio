// API route for AI-powered cost reasoning

import { NextRequest, NextResponse } from "next/server";
import { serverRateLimiter, getClientIP } from "@/lib/server/rate-limit";
import { sessionManager } from "@/lib/server/session";
import { aiClient } from "@/lib/ai/client";
import {
  costRequestSchema,
  validatePrompt,
  sanitizeInput,
} from "@/lib/ai/validation";
import { buildCostReasoningPrompt } from "@/lib/ai/prompts";

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
    const validationResult = costRequestSchema.safeParse(body);

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

    const {
      trafficEstimate,
      aiUsagePattern,
      currentArchitecture,
      sessionId,
      provider = "openai",
    } = validationResult.data;

    // Validate and sanitize input
    const sanitized = sanitizeInput(trafficEstimate);
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
      currentSessionId = sessionManager.createSession({
        trafficEstimate,
        aiUsagePattern,
        currentArchitecture,
      });
    } else {
      const session = sessionManager.getSession(currentSessionId);
      if (!session) {
        currentSessionId = sessionManager.createSession({
          trafficEstimate,
          aiUsagePattern,
          currentArchitecture,
        });
      }
    }

    // Add user message to session
    const userMessage = `Traffic: ${sanitized}${
      aiUsagePattern ? `\nAI Usage: ${aiUsagePattern}` : ""
    }${currentArchitecture ? `\nArchitecture: ${currentArchitecture}` : ""}`;
    sessionManager.addMessage(currentSessionId, "user", userMessage);

    // Get session history
    const sessionHistory = sessionManager.getMessages(currentSessionId);

    // Build prompt
    const prompt = buildCostReasoningPrompt({
      userInput: sanitized,
      sessionHistory: sessionHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      metadata: {
        trafficEstimate,
        aiUsagePattern,
        currentArchitecture,
      },
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
      "You are a cost optimization expert. Always respond with valid JSON. Focus on engineering intuition and real-world cost patterns, not precise billing.";

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
    console.error("Cost reasoning error:", error);

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
