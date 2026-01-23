// Input validation and sanitization for AI requests

import { z } from "zod";

export const MAX_PROMPT_LENGTH = 2000;
export const MAX_INPUT_LENGTH = 5000;

// Blocked patterns for abuse prevention
const BLOCKED_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?(?:bit\.ly|tinyurl|t\.co|goo\.gl)\/\S+/gi, // URL shorteners
  /(?:password|api[_-]?key|secret|token)\s*[:=]\s*\S+/gi, // Credentials
  /(?:<script|javascript:|on\w+\s*=)/gi, // XSS attempts
];

export function sanitizeInput(input: string): string {
  // Remove null bytes and control characters (except newlines and tabs)
  let sanitized = input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

export function validatePrompt(prompt: string): {
  valid: boolean;
  error?: string;
} {
  // Check length
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters.`,
    };
  }

  if (prompt.length === 0) {
    return {
      valid: false,
      error: "Prompt cannot be empty.",
    };
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(prompt)) {
      return {
        valid: false,
        error: "Input contains blocked content.",
      };
    }
  }

  return { valid: true };
}

// Schema for architecture planning requests
export const architectureRequestSchema = z.object({
  appIdea: z.string().min(3, "App idea must be at least 3 characters").max(MAX_PROMPT_LENGTH),
  constraints: z
    .object({
      scale: z.string().optional(),
      budget: z.string().optional(),
      teamSize: z.string().optional(),
    })
    .optional(),
  sessionId: z.string().uuid().nullish(),
  provider: z.enum(["openai", "anthropic"]).optional(),
});

// Schema for flow generation requests
export const flowRequestSchema = z.object({
  featureName: z.string().min(3).max(200),
  context: z.string().max(MAX_INPUT_LENGTH).optional(),
  sessionId: z.string().uuid().nullish(),
  provider: z.enum(["openai", "anthropic"]).optional(),
});

// Schema for cost reasoning requests
export const costRequestSchema = z.object({
  trafficEstimate: z.string().min(1).max(500),
  aiUsagePattern: z.string().max(MAX_INPUT_LENGTH).optional(),
  currentArchitecture: z.string().max(MAX_INPUT_LENGTH).optional(),
  sessionId: z.string().uuid().nullish(),
  provider: z.enum(["openai", "anthropic"]).optional(),
});

// Schema for system design requests
export const systemDesignRequestSchema = z.object({
  baseArchitecture: z.string().min(3, "Base architecture must be at least 3 characters").max(MAX_INPUT_LENGTH),
  changes: z
    .object({
      database: z.string().optional(),
      cache: z.boolean().optional(),
      queue: z.boolean().optional(),
      cdn: z.boolean().optional(),
    })
    .optional(),
  sessionId: z.string().uuid().nullish(),
  provider: z.enum(["openai", "anthropic"]).optional(),
});

export type ArchitectureRequest = z.infer<typeof architectureRequestSchema>;
export type FlowRequest = z.infer<typeof flowRequestSchema>;
export type CostRequest = z.infer<typeof costRequestSchema>;
export type SystemDesignRequest = z.infer<typeof systemDesignRequestSchema>;
