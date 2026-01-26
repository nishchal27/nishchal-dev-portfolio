import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackendSystemsBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export function BackendSystemsBadge({ className, showIcon = true }: BackendSystemsBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-2.5 py-1 rounded-md",
        "text-xs font-medium font-mono tracking-tight",
        "bg-slate-900/60 text-slate-300/90",
        "border border-slate-700/40",
        "backdrop-blur-sm",
        "transition-colors",
        className
      )}
    >
      {showIcon && <Layers className="h-3 w-3 text-slate-400/80" strokeWidth={2} />}
      <span>Backend / Systems</span>
    </span>
  );
}
