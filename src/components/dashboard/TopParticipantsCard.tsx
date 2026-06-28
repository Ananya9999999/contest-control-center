import { Link } from "@tanstack/react-router";
import { useLeaderboard } from "@/lib/contest-store";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopParticipantsCard() {
  const rows = useLeaderboard().slice(0, 5);
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Top performers</h3>
        </div>
        <Button asChild size="sm" variant="ghost" className="gap-1 text-xs">
          <Link to="/leaderboard">
            Full board <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((r) => (
          <li key={r.participant.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <div
              className={
                "grid h-8 w-8 shrink-0 place-items-center rounded-md font-mono text-sm font-bold " +
                (r.rank === 1
                  ? "bg-primary text-primary-foreground"
                  : r.rank <= 3
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground")
              }
            >
              {r.rank}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{r.participant.handle}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {r.participant.college}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm font-bold tabular-nums">{r.score}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {r.solved} solved
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
