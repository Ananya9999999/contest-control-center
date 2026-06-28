import { useMemo } from "react";
import { useContest } from "@/lib/contest-store";
import { VerdictBadge } from "@/components/common/VerdictBadge";
import { fmtRelative } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Pause, Play, Radio } from "lucide-react";

export function LiveSubmissionsFeed({ limit = 12 }: { limit?: number }) {
  const { state, dispatch } = useContest();
  const rows = useMemo(() => state.submissions.slice(0, limit), [state.submissions, limit]);

  return (
    <div className="surface-card flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <h3 className="truncate text-sm font-semibold">Live submission feed</h3>
          <span className="status-dot" aria-hidden />
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => dispatch({ type: "TOGGLE_FEED" })}
          className="gap-1.5 text-xs"
        >
          {state.feedPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {state.feedPaused ? "Resume" : "Pause"}
        </Button>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((s) => {
          const p = state.participants.find((x) => x.id === s.participantId);
          const prob = state.problems.find((x) => x.id === s.problemId);
          return (
            <li
              key={s.id}
              className="row-enter grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 text-sm"
            >
              <VerdictBadge verdict={s.verdict} />
              <div className="min-w-0">
                <div className="truncate font-medium">
                  <span className="text-foreground">{p?.handle ?? "unknown"}</span>
                  <span className="mx-1.5 text-muted-foreground">·</span>
                  <span className="font-mono text-xs text-muted-foreground">{prob?.code}</span>
                </div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {s.language} · {s.runtimeMs}ms · {(s.memoryKb / 1024).toFixed(1)} MB
                </div>
              </div>
              <div className="shrink-0 text-right text-[11px] text-muted-foreground">
                {fmtRelative(s.submittedAt)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
