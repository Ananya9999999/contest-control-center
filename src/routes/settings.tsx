import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { SimpleInput } from "@/components/ui/simple-input";
import { Switch } from "@/components/ui/switch";
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
  const { state } = useContest();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contest settings"
        description="Operational controls for the live contest."
      />

      <div className="surface-card p-5">
        <h3 className="text-sm font-semibold">General</h3>
        <Button onClick={() => toast.success("Clicked!")}>
          Save changes
        </Button>
      </div>
    </div>
  );
}