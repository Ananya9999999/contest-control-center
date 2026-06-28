import { cn } from "@/lib/utils";
import type { Verdict } from "@/lib/mock-data";

const map: Record<Verdict, { label: string; className: string }> = {
  AC: { label: "AC", className: "bg-success/15 text-success border-success/30" },
  WA: { label: "WA", className: "bg-destructive/15 text-destructive border-destructive/30" },
  TLE: { label: "TLE", className: "bg-warning/15 text-warning border-warning/30" },
  RE: { label: "RE", className: "bg-destructive/15 text-destructive border-destructive/30" },
  CE: { label: "CE", className: "bg-muted text-muted-foreground border-border" },
  MLE: { label: "MLE", className: "bg-warning/15 text-warning border-warning/30" },
  Pending: { label: "…", className: "bg-info/15 text-info border-info/30" },
};

export function VerdictBadge({ verdict, className }: { verdict: Verdict; className?: string }) {
  const m = map[verdict];
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-md border px-2 font-mono text-[11px] font-bold tracking-wide",
        m.className,
        className,
      )}
    >
      {m.label}
    </span>
  );
}
