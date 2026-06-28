import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { SimpleInput } from "@/components/ui/simple-input";
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

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />

      <div className="surface-card p-5">
        <ToggleRow
          label="Test"
          description="Test toggle"
          checked={config.frozen}
          onChange={(v) =>
            dispatch({ type: "SET_CONFIG", payload: { frozen: v } })
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