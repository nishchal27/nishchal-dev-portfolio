// Prompt engineering for different AI features
// Structured prompts that guide AI to produce engineering-focused outputs

export type AIProvider = "openai" | "anthropic";

export interface PromptContext {
  userInput: string;
  sessionHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  metadata?: Record<string, unknown>;
}

export function buildArchitecturePrompt(context: PromptContext): string {
  const { userInput, sessionHistory, metadata } = context;
  const constraints = metadata?.constraints as
    | { scale?: string; budget?: string; teamSize?: string }
    | undefined;

  let prompt = `You are an expert software architect helping to design a system architecture. 

User's app idea: ${userInput}

`;

  if (constraints) {
    prompt += `Constraints:
${constraints.scale ? `- Scale: ${constraints.scale}` : ""}
${constraints.budget ? `- Budget: ${constraints.budget}` : ""}
${constraints.teamSize ? `- Team size: ${constraints.teamSize}` : ""}

`;
  }

  prompt += `Your task is to design a production-ready system architecture. Respond with a JSON object containing:

{
  "architecture": {
    "components": [
      {
        "id": "unique-id",
        "name": "Component Name",
        "type": "service|database|cache|queue|cdn|api|storage",
        "description": "What this component does",
        "technologies": ["tech1", "tech2"],
        "tradeoffs": ["pro", "con"],
        "failurePoints": ["potential failure"],
        "scalingNotes": "How this scales"
      }
    ],
    "connections": [
      {
        "from": "component-id-1",
        "to": "component-id-2",
        "type": "data-flow|api-call|event"
      }
    ]
  },
  "explanation": "High-level explanation of the architecture",
  "tradeoffs": ["Key tradeoff 1", "Key tradeoff 2"],
  "risks": ["Risk 1", "Risk 2"],
  "scalingConsiderations": "How this architecture scales"
}

Focus on:
- Real-world production considerations
- Cost implications
- Performance characteristics
- Failure modes
- Scaling strategies

Be specific about technologies and patterns.`;

  if (sessionHistory && sessionHistory.length > 0) {
    prompt += `\n\nPrevious conversation context:\n`;
    sessionHistory.slice(-3).forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });
  }

  return prompt;
}

export function buildFlowPrompt(context: PromptContext): string {
  const { userInput, sessionHistory } = context;

  let prompt = `You are an expert software engineer designing feature flows. 

User wants a flow for: ${userInput}

Generate a detailed step-by-step flow. Respond with JSON:

{
  "feature": "${userInput}",
  "steps": [
    {
      "id": "1",
      "title": "Step title",
      "description": "What happens in this step",
      "component": "Component name",
      "edgeCases": ["edge case 1", "edge case 2"],
      "failureHandling": "How failures are handled",
      "retryLogic": "Retry strategy if applicable"
    }
  ],
  "overview": "High-level flow description",
  "failurePoints": ["Critical failure point 1", "Critical failure point 2"],
  "optimizationTips": ["Tip 1", "Tip 2"]
}

Focus on:
- Real-world failure scenarios
- Edge cases engineers should consider
- Retry and error handling strategies
- Performance implications
- Security considerations`;

  if (sessionHistory && sessionHistory.length > 0) {
    prompt += `\n\nPrevious context:\n`;
    sessionHistory.slice(-3).forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });
  }

  return prompt;
}

export function buildCostReasoningPrompt(context: PromptContext): string {
  const { userInput, sessionHistory, metadata } = context;
  const trafficEstimate = metadata?.trafficEstimate as string | undefined;
  const aiUsagePattern = metadata?.aiUsagePattern as string | undefined;
  const currentArchitecture = metadata?.currentArchitecture as
    | string
    | undefined;

  let prompt = `You are a cost optimization expert analyzing system costs.

Traffic estimate: ${trafficEstimate || userInput}
${aiUsagePattern ? `AI usage pattern: ${aiUsagePattern}` : ""}
${currentArchitecture ? `Current architecture: ${currentArchitecture}` : ""}

Analyze cost implications and provide engineering insights. Respond with JSON:

{
  "costBreakdown": {
    "components": [
      {
        "component": "Component name",
        "estimatedCost": "Cost estimate or range",
        "costDrivers": ["Driver 1", "Driver 2"],
        "optimizationLevers": ["Optimization 1", "Optimization 2"]
      }
    ],
    "totalEstimatedCost": "Total cost estimate",
    "costGrowthCurve": "How costs scale with traffic"
  },
  "optimizationOpportunities": [
    {
      "area": "Area to optimize",
      "potentialSavings": "Potential savings",
      "implementationComplexity": "low|medium|high",
      "description": "What to do"
    }
  ],
  "breakpoints": [
    {
      "trafficLevel": "Traffic level",
      "description": "What breaks or needs to change",
      "recommendation": "What to do"
    }
  ],
  "reasoning": "Detailed cost reasoning and engineering intuition"
}

Focus on:
- Engineering intuition, not precise billing
- Where costs explode
- Optimization levers
- Architecture breakpoints
- Real-world cost patterns`;

  if (sessionHistory && sessionHistory.length > 0) {
    prompt += `\n\nPrevious context:\n`;
    sessionHistory.slice(-3).forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });
  }

  return prompt;
}

export function buildSystemDesignPrompt(context: PromptContext): string {
  const { userInput, sessionHistory, metadata } = context;
  const changes = metadata?.changes as
    | {
        database?: string;
        cache?: boolean;
        queue?: boolean;
        cdn?: boolean;
      }
    | undefined;

  let prompt = `You are analyzing system design changes and their implications.

Base architecture: ${userInput}

`;

  if (changes) {
    prompt += `Proposed changes:
${changes.database ? `- Database: ${changes.database}` : ""}
${changes.cache !== undefined ? `- Cache: ${changes.cache ? "enabled" : "disabled"}` : ""}
${changes.queue !== undefined ? `- Queue: ${changes.queue ? "enabled" : "disabled"}` : ""}
${changes.cdn !== undefined ? `- CDN: ${changes.cdn ? "enabled" : "disabled"}` : ""}

`;
  }

  prompt += `Analyze the impact of these changes. Respond with JSON:

{
  "updatedArchitecture": {
    "components": [
      {
        "id": "unique-id",
        "name": "Component Name",
        "type": "service|database|cache|queue|cdn|api|storage",
        "description": "What this component does",
        "technologies": ["tech1", "tech2"]
      }
    ],
    "connections": [
      {
        "from": "component-id-1",
        "to": "component-id-2",
        "type": "data-flow|api-call|event"
      }
    ]
  },
  "impact": {
    "cost": {
      "change": "increase|decrease|neutral",
      "reasoning": "Why costs change",
      "estimate": "Rough estimate"
    },
    "performance": {
      "change": "improvement|degradation|neutral",
      "reasoning": "Why performance changes",
      "metrics": ["metric 1", "metric 2"]
    },
    "complexity": {
      "change": "increase|decrease|neutral",
      "reasoning": "Why complexity changes"
    }
  },
  "tradeoffs": ["Tradeoff 1", "Tradeoff 2"],
  "recommendation": "Should make this change? Why or why not?"
}

Be specific about real-world implications.`;

  if (sessionHistory && sessionHistory.length > 0) {
    prompt += `\n\nPrevious context:\n`;
    sessionHistory.slice(-3).forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });
  }

  return prompt;
}
