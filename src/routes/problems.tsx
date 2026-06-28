import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export const Route = createFileRoute("/problems")({
  head: () => ({
    meta: [
      { title: "Problems · Contest Control Center" },
      { name: "description", content: "Browse contest problems with live acceptance stats and difficulty breakdown." },
    ],
  }),
  component: ProblemsPage,
});

const diffTone = {
  Easy: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Hard: "bg-destructive/15 text-destructive border-destructive/30",
};

function ProblemsPage() {
  const { state } = useContest();

  const enriched = useMemo(() => {
    return state.problems.map((p) => {
      const subs = state.submissions.filter((s) => s.problemId === p.id);
      const ac = subs.filter((s) => s.verdict === "AC").length;
      const firstAC = subs
        .filter((s) => s.verdict === "AC")
        .sort((a, b) => a.submittedAt - b.submittedAt)[0];
      const firstSolver = firstAC
        ? state.participants.find((x) => x.id === firstAC.participantId)
        : null;
      return { ...p, liveSubs: subs.length, liveAc: ac, firstSolver };
    });
  }, [state.problems, state.submissions, state.participants]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Problem set"
        description={`${state.problems.length} problems · live acceptance statistics`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {enriched.map((p) => {
          const rate = p.liveSubs ? (p.liveAc / p.liveSubs) * 100 : 0;
          return (
            <div key={p.id} className="surface-card flex flex-col p-5 transition hover:translate-y-[-2px]">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-muted-foreground">{p.code}</div>
                  <h3 className="mt-0.5 truncate text-base font-semibold">{p.title}</h3>
                </div>
                <Badge className={cn("shrink-0 border", diffTone[p.difficulty])} variant="outline">
                  {p.difficulty}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-accent px-1.5 py-0.5 font-mono text-[10px] text-accent-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-mono text-base font-bold tabular-nums">{p.points}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">pts</div>
                </div>
                <div>
                  <div className="font-mono text-base font-bold tabular-nums">{p.liveAc}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AC</div>
                </div>
                <div>
                  <div className="font-mono text-base font-bold tabular-nums">{p.liveSubs}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">subs</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Acceptance</span>
                  <span className="font-mono">{rate.toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      rate >= 50 ? "bg-success" : rate >= 25 ? "bg-warning" : "bg-destructive",
                    )}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
                {p.firstSolver ? (
                  <>First solve by <span className="font-medium text-foreground">{p.firstSolver.handle}</span></>
                ) : (
                  <>No solver yet</>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
