import { createFileRoute } from "@tanstack/react-router";
import { useContest, useLeaderboard } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard · Contest Control Center" },
      { name: "description", content: "Live standings of all contest participants, ranked by score and problems solved." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const rows = useLeaderboard();
  const { state } = useContest();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leaderboard"
        description="Standings update live as new submissions arrive."
        actions={
          state.config.frozen ? (
            <Badge variant="secondary" className="gap-1">
              <Snowflake className="h-3 w-3" /> Frozen
            </Badge>
          ) : (
            <Badge className="gap-1 bg-success/15 text-success border-success/30">Live</Badge>
          )
        }
      />

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Participant</th>
                <th className="px-3 py-3 text-right">Score</th>
                <th className="px-3 py-3 text-right">Solved</th>
                {state.problems.map((p) => (
                  <th key={p.id} className="px-2 py-3 text-center font-mono text-[10px]">
                    {p.code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r) => (
                <tr
                  key={r.participant.id}
                  className="border-t border-border transition hover:bg-accent/30"
                >
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "inline-grid h-7 w-7 place-items-center rounded-md font-mono text-xs font-bold",
                        r.rank === 1
                          ? "bg-primary text-primary-foreground"
                          : r.rank <= 3
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {r.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{r.participant.handle}</div>
                    <div className="text-[11px] text-muted-foreground">{r.participant.college}</div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold tabular-nums">{r.score}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
                    {r.solved}/{state.problems.length}
                  </td>
                  {state.problems.map((p) => {
                    const cell = r.byProblem[p.id];
                    return (
                      <td key={p.id} className="px-2 py-2.5 text-center">
                        {cell.solved ? (
                          <span className="inline-grid h-6 w-6 place-items-center rounded-md bg-success/15 font-mono text-[10px] font-bold text-success">
                            +
                          </span>
                        ) : cell.attempts > 0 ? (
                          <span className="inline-grid h-6 w-6 place-items-center rounded-md bg-destructive/10 font-mono text-[10px] font-bold text-destructive">
                            -{cell.attempts}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
