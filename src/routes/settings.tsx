import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { SimpleSwitch } from "@/components/ui/simple-switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Contest Control Center" },
      { name: "description", content: "Configure contest settings and operational controls." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, dispatch } = useContest();
  const { config } = state;

  const handleToggleSubmissions = (v: boolean) => {
    dispatch({ type: "SET_CONFIG", payload: { submissionsEnabled: v } });
  };

  const handleToggleFrozen = (v: boolean) => {
    dispatch({ type: "SET_CONFIG", payload: { frozen: v } });
  };

  const handleTogglePaused = (v: boolean) => {
    dispatch({ type: "SET_CONFIG", payload: { paused: v } });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />

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
            onChange={handleToggleSubmissions}
          />
          <ToggleRow
            label="Freeze scoreboard"
            description="Hide rank changes during the final stretch."
            checked={config.frozen}
            onChange={handleToggleFrozen}
          />
          <ToggleRow
            label="Pause contest"
            description="Stops the clock and the live submission stream."
            checked={config.paused}
            onChange={handleTogglePaused}
          />
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