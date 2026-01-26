// Unified AI client for OpenAI and Anthropic
// Handles provider selection, error handling, retries, and streaming

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { monitoringService } from "./monitoring";
import type { AIProvider } from "./prompts";

export interface AIResponse {
  content: string;
  tokensUsed?: number;
  provider: AIProvider;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

class AIClient {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private readonly maxTokens: number;
  private readonly maxRetries = 3;

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }

    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }

    this.maxTokens = parseInt(process.env.AI_MAX_TOKENS || "2000", 10);
  }

  private async callOpenAI(
    prompt: string,
    systemPrompt?: string,
    stream = false
  ): Promise<AIResponse> {
    if (!this.openai) {
      throw new Error("OpenAI API key not configured");
    }

    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      if (stream) {
        // For streaming, we'll handle it differently
        throw new Error("Streaming not implemented in this method");
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Using mini for cost efficiency
        messages: [
          ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
          { role: "user" as const, content: prompt },
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
        stream: false,
      });

      // Type assertion: we know stream is false, so this is a ChatCompletion
      const completion = response as OpenAI.Chat.Completions.ChatCompletion;
      const content = completion.choices[0]?.message?.content || "";
      tokensUsed =
        (completion.usage?.prompt_tokens || 0) +
        (completion.usage?.completion_tokens || 0);

      const duration = Date.now() - startTime;

      monitoringService.logUsage({
        timestamp: Date.now(),
        provider: "openai",
        endpoint: "chat.completions",
        tokensUsed,
        success: true,
        duration,
      });

      return {
        content,
        tokensUsed,
        provider: "openai",
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      monitoringService.logUsage({
        timestamp: Date.now(),
        provider: "openai",
        endpoint: "chat.completions",
        success: false,
        error: errorMessage,
        duration,
      });

      throw error;
    }
  }

  private async callAnthropic(
    prompt: string,
    systemPrompt?: string,
    stream = false
  ): Promise<AIResponse> {
    if (!this.anthropic) {
      throw new Error("Anthropic API key not configured");
    }

    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      if (stream) {
        throw new Error("Streaming not implemented in this method");
      }

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: this.maxTokens,
        system: systemPrompt || "You are a helpful engineering assistant.",
        messages: [{ role: "user", content: prompt }],
        stream: false,
      });

      // Type assertion: we know stream is false, so this is a Message
      const message = response as Anthropic.Messages.Message;
      const content = message.content[0]?.type === "text" 
        ? message.content[0].text 
        : "";
      tokensUsed = (message.usage?.input_tokens || 0) + (message.usage?.output_tokens || 0);

      const duration = Date.now() - startTime;

      monitoringService.logUsage({
        timestamp: Date.now(),
        provider: "anthropic",
        endpoint: "messages.create",
        tokensUsed,
        success: true,
        duration,
      });

      return {
        content,
        tokensUsed,
        provider: "anthropic",
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      monitoringService.logUsage({
        timestamp: Date.now(),
        provider: "anthropic",
        endpoint: "messages.create",
        success: false,
        error: errorMessage,
        duration,
      });

      throw error;
    }
  }

  async generate(
    prompt: string,
    provider: AIProvider = "openai",
    systemPrompt?: string
  ): Promise<AIResponse> {
    // Auto-select provider if preferred one is not available
    if (provider === "openai" && !this.openai) {
      if (this.anthropic) {
        provider = "anthropic";
      } else {
        throw new Error("No AI provider configured");
      }
    }

    if (provider === "anthropic" && !this.anthropic) {
      if (this.openai) {
        provider = "openai";
      } else {
        throw new Error("No AI provider configured");
      }
    }

    // Retry logic with exponential backoff
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        if (provider === "openai") {
          return await this.callOpenAI(prompt, systemPrompt);
        } else {
          return await this.callAnthropic(prompt, systemPrompt);
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on certain errors
        if (
          error instanceof Error &&
          (error.message.includes("rate limit") ||
            error.message.includes("authentication") ||
            error.message.includes("invalid"))
        ) {
          throw error;
        }

        // Exponential backoff
        if (attempt < this.maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError || new Error("Failed to generate response");
  }

  isProviderAvailable(provider: AIProvider): boolean {
    if (provider === "openai") {
      return this.openai !== null;
    }
    return this.anthropic !== null;
  }

  getAvailableProviders(): AIProvider[] {
    const providers: AIProvider[] = [];
    if (this.openai) providers.push("openai");
    if (this.anthropic) providers.push("anthropic");
    return providers;
  }
}

export const aiClient = new AIClient();
