// Monitoring and logging for AI API calls
// Logs API usage without storing user data

interface APIUsageLog {
  timestamp: number;
  provider: "openai" | "anthropic";
  endpoint: string;
  tokensUsed?: number;
  success: boolean;
  error?: string;
  duration?: number;
}

class MonitoringService {
  private logs: APIUsageLog[] = [];
  private readonly maxLogs = 1000; // Keep last 1000 logs in memory

  logUsage(log: APIUsageLog): void {
    this.logs.push(log);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In production, you might want to send to an external service
    // For now, we just log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[AI Usage]", {
        provider: log.provider,
        endpoint: log.endpoint,
        tokens: log.tokensUsed,
        success: log.success,
        duration: log.duration,
      });
    }
  }

  getStats(): {
    totalCalls: number;
    successRate: number;
    totalTokens: number;
    byProvider: Record<string, { calls: number; tokens: number }>;
  } {
    const stats = {
      totalCalls: this.logs.length,
      successRate: 0,
      totalTokens: 0,
      byProvider: {} as Record<string, { calls: number; tokens: number }>,
    };

    if (this.logs.length === 0) {
      return stats;
    }

    let successfulCalls = 0;
    for (const log of this.logs) {
      if (log.success) {
        successfulCalls++;
      }

      if (log.tokensUsed) {
        stats.totalTokens += log.tokensUsed;
      }

      if (!stats.byProvider[log.provider]) {
        stats.byProvider[log.provider] = { calls: 0, tokens: 0 };
      }

      stats.byProvider[log.provider].calls++;
      if (log.tokensUsed) {
        stats.byProvider[log.provider].tokens += log.tokensUsed;
      }
    }

    stats.successRate = successfulCalls / this.logs.length;

    return stats;
  }

  getRecentLogs(count: number = 10): APIUsageLog[] {
    return this.logs.slice(-count);
  }
}

export const monitoringService = new MonitoringService();
