import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { SimpleSwitch } from "@/components/ui/simple-switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Contest Control Center" },
      { name: "description", content: "Configure contest name, duration, freeze, and submission gating." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, dispatch } = useContest();
  const { config } = state;
  const [name, setName] = useState(config.name);
  const [durationHrs, setDurationHrs] = useState(config.durationMs / 3_600_000);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="surface-card p-5">
          <h3 className="text-sm font-semibold">General</h3>
          <p className="mt-1 text-xs text-muted-foreground">Display and timing configuration.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Contest name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Duration (hours)</label>
            </div>
            <Button
              onClick={() => {
                dispatch({
                  type: "SET_CONFIG",
                  payload: { name, durationMs: durationHrs * 3_600_000 },
                });
                toast.success("Settings saved");
              }}
            >
              Save changes
            </Button>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="text-sm font-semibold">Operational controls</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Toggle real-time behaviors of the contest engine.
          </p>
          <div className="mt-4 space-y-4">
            <ToggleRow
              label="Submissions enabled"
              description="Participants can submit code."
              checked={config.submissionsEnabled}
              onChange={(v) =>
                dispatch({ type: "SET_CONFIG", payload: { submissionsEnabled: v } })
              }
            />
            <ToggleRow
              label="Freeze scoreboard"
              description="Hide rank changes during the final stretch."
              checked={config.frozen}
              onChange={(v) => dispatch({ type: "SET_CONFIG", payload: { frozen: v } })}
            />
            <ToggleRow
              label="Pause contest"
              description="Stops the clock and the live submission stream."
              checked={config.paused}
              onChange={(v) => dispatch({ type: "SET_CONFIG", payload: { paused: v } })}
            />
          </div>
        </div>

        <div className="surface-card p-5 md:col-span-2">
          <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Irreversible operations affecting the live contest.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => toast.error("End contest is disabled in demo mode")}
            >
              End contest now
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.message("Export queued (demo)")}
            >
              Export full results (CSV)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="truncate text-xs text-muted-foreground">{description}</div>
      </div>
      <SimpleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}