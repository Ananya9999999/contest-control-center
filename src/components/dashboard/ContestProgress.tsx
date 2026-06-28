import { useContest } from "@/lib/contest-store";
import { fmtDuration } from "@/lib/format";

export function ContestProgress() {
  const { state, elapsedMs, remainingMs, progress } = useContest();
  return (
    <div className="surface-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">Contest progress</h3>
        <span className="text-xs text-muted-foreground">{progress.toFixed(1)}%</span>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-warning to-destructive transition-[width] duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-mono text-base font-bold tabular-nums">{fmtDuration(elapsedMs)}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">elapsed</div>
        </div>
        <div>
          <div className="font-mono text-base font-bold tabular-nums text-gradient">
            {fmtDuration(remainingMs)}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">left</div>
        </div>
        <div>
          <div className="font-mono text-base font-bold tabular-nums">
            {fmtDuration(state.config.durationMs)}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">total</div>
        </div>
      </div>
    </div>
  );
}
