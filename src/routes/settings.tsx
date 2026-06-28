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
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />
      <div>
        <SimpleSwitch 
          checked={checked} 
          onChange={(v) => setChecked(v)} 
        />
      </div>
    </div>
  );
}