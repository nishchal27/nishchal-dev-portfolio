"use client";

import { Loader2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Error",
  message,
  onRetry,
  retryLabel = "Retry",
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <Card className="border-red-500/50 bg-red-500/5 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-500 mb-1">{title}</h3>
            <p className="text-sm text-text-secondary mb-3">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-accent hover:text-accent-hover underline"
              >
                {retryLabel}
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface RateLimitStateProps {
  retryAfter?: number;
  remaining?: {
    hourly: number;
    daily: number;
  };
}

export function RateLimitState({
  retryAfter,
  remaining,
}: RateLimitStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <Card className="border-yellow-500/50 bg-yellow-500/5 p-6">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-500 mb-1">
              Rate Limit Exceeded
            </h3>
            <p className="text-sm text-text-secondary mb-2">
              You've reached the rate limit for AI requests.
            </p>
            {retryAfter && (
              <p className="text-sm text-text-secondary mb-2">
                Please try again in {Math.ceil(retryAfter / 60)} minutes.
              </p>
            )}
            {remaining && (
              <div className="text-xs text-text-secondary space-y-1">
                <p>Remaining requests: {remaining.hourly} per hour</p>
                <p>Remaining requests: {remaining.daily} per day</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface StreamingTextProps {
  text: string;
  className?: string;
}

export function StreamingText({ text, className = "" }: StreamingTextProps) {
  return (
    <motion.p
      key={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`text-sm whitespace-pre-wrap ${className}`}
    >
      {text}
    </motion.p>
  );
}

interface SkeletonLoaderProps {
  lines?: number;
}

export function SkeletonLoader({ lines = 3 }: SkeletonLoaderProps) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-surface rounded"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
}
