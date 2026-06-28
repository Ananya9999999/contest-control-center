import { SidebarTrigger } from "@/components/ui/sidebar";
import { useContest } from "@/lib/contest-store";
import { fmtDuration } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pause, Play, Snowflake, AlertTriangle } from "lucide-react";

export function TopBar() {
  const { state, remainingMs, progress, dispatch } = useContest();
  const { config } = state;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden min-w-0 sm:block">
          <div className="truncate text-sm font-semibold">{config.name}</div>
          <div className="text-[11px] text-muted-foreground">
            {config.paused ? "Contest paused" : "Live contest in progress"}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {config.frozen && (
            <Badge variant="secondary" className="hidden gap-1 sm:inline-flex">
              <Snowflake className="h-3 w-3" /> Scoreboard frozen
            </Badge>
          )}
          {!config.submissionsEnabled && (
            <Badge variant="destructive" className="hidden gap-1 sm:inline-flex">
              <AlertTriangle className="h-3 w-3" /> Submissions closed
            </Badge>
          )}

          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right">
              <div className="font-mono text-lg leading-none font-bold tabular-nums text-gradient">
                {fmtDuration(remainingMs)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                time remaining
              </div>
            </div>
            <div className="h-9 w-32 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-warning transition-[width] duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button
            size="sm"
            variant={config.paused ? "default" : "secondary"}
            onClick={() => dispatch({ type: "SET_CONFIG", payload: { paused: !config.paused } })}
            className="gap-1.5"
          >
            {config.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span className="hidden sm:inline">{config.paused ? "Resume" : "Pause"}</span>
          </Button>
        </div>
      </div>

      {/* Mobile clock */}
      <div className="flex items-center gap-3 border-t border-border px-3 py-2 md:hidden">
        <div className="font-mono text-base font-bold tabular-nums text-gradient">
          {fmtDuration(remainingMs)}
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-warning"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
