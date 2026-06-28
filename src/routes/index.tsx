import { createFileRoute } from "@tanstack/react-router";
import { Users, CheckCircle2, Code2, Zap } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { LiveSubmissionsFeed } from "@/components/dashboard/LiveSubmissionsFeed";
import { ContestProgress } from "@/components/dashboard/ContestProgress";
import { TopParticipantsCard } from "@/components/dashboard/TopParticipantsCard";
import { ProblemHealth } from "@/components/dashboard/ProblemHealth";
import { useStats } from "@/lib/contest-store";
import { fmtNumber } from "@/lib/format";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Contest Control Center" },
      { name: "description", content: "Live overview of contest activity, submissions, and standings." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useStats();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mission Control"
        description="Real-time snapshot of contest activity, submissions, and standings."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Active participants"
          value={fmtNumber(stats.active)}
          hint={`${stats.totalParticipants} registered`}
          icon={Users}
          tone="info"
        />
        <StatCard
          label="Submissions"
          value={fmtNumber(stats.total)}
          hint={`${stats.perMin}/min last minute`}
          icon={Code2}
        />
        <StatCard
          label="Accepted"
          value={fmtNumber(stats.ac)}
          hint={`${stats.acRate.toFixed(1)}% AC rate`}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Throughput"
          value={`${stats.perMin}`}
          hint="submissions / minute"
          icon={Zap}
          tone="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <ContestProgress />
          <LiveSubmissionsFeed />
        </div>
        <div className="space-y-4">
          <TopParticipantsCard />
          <ProblemHealth />
        </div>
      </div>
    </div>
  );
}
