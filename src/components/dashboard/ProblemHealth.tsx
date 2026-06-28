import { useMemo } from "react";
import { useContest } from "@/lib/contest-store";
import { cn } from "@/lib/utils";

export function ProblemHealth() {
  const { state } = useContest();

  const data = useMemo(() => {
    return state.problems.map((p) => {
      const subs = state.submissions.filter((s) => s.problemId === p.id);
      const ac = subs.filter((s) => s.verdict === "AC").length;
      const rate = subs.length ? (ac / subs.length) * 100 : 0;
      return { ...p, subs: subs.length, ac, rate };
    });
  }, [state.problems, state.submissions]);

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Problem health</h3>
        <p className="text-xs text-muted-foreground">Acceptance rate per problem</p>
      </div>
      <div className="divide-y divide-border">
        {data.map((p) => (
          <div key={p.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{p.code}</span>
                <span className="truncate font-medium">{p.title}</span>
              </div>
              <span
                className={cn(
                  "shrink-0 font-mono text-xs font-bold tabular-nums",
                  p.rate >= 50 ? "text-success" : p.rate >= 25 ? "text-warning" : "text-destructive",
                )}
              >
                {p.rate.toFixed(0)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  p.rate >= 50 ? "bg-success" : p.rate >= 25 ? "bg-warning" : "bg-destructive",
                )}
                style={{ width: `${p.rate}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>{p.ac} AC</span>
              <span>{p.subs} total</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
