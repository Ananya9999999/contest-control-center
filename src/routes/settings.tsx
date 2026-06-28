import { createFileRoute } from "@tanstack/react-router";
import { useContest } from "@/lib/contest-store";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { state } = useContest();
  
  return (
    <div>
      <h1>Settings</h1>
      <p>Contest: {state.config.name}</p>
    </div>
  );
}