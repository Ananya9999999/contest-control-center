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

  const handleSave = () => {
    dispatch({
      type: "SET_CONFIG",
      payload: { frozen: true },
    });
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />

      <div className="surface-card p-5">
        <Button onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  );
}