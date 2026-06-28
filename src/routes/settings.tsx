import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { SimpleSwitch } from "@/components/ui/simple-switch";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { state, dispatch } = useContest();
  const { config } = state;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />
      <div className="surface-card p-5">
        <ToggleRow
          label="Submissions enabled"
          description="Participants can submit code."
          checked={config.submissionsEnabled}
          onChange={(v) =>
            dispatch({ type: "SET_CONFIG", payload: { submissionsEnabled: v } })
          }
        />
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