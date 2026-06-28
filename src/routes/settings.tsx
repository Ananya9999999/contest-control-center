import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { SimpleSwitch } from "@/components/ui/simple-switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { state, dispatch } = useContest();
  const { config } = state;
  const [name, setName] = useState(config.name);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />

      <div className="surface-card p-5">
        <h3 className="text-sm font-semibold">General</h3>
        <div className="mt-4 space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Button
            onClick={() => {
              dispatch({
                type: "SET_CONFIG",
                payload: { name, durationMs: 3 * 3_600_000 },
              });
              toast.success("Settings saved");
            }}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
