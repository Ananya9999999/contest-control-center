import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VerdictBadge } from "@/components/common/VerdictBadge";
import { fmtRelative } from "@/lib/format";
import { RefreshCcw, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/submissions")({
  head: () => ({
    meta: [
      { title: "Submissions · Contest Control Center" },
      { name: "description", content: "Inspect, filter and rejudge every contest submission in real time." },
    ],
  }),
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const { state, dispatch } = useContest();
  const [q, setQ] = useState("");
  const [verdict, setVerdict] = useState("all");
  const [problem, setProblem] = useState("all");
  const [lang, setLang] = useState("all");

  const filtered = useMemo(() => {
    return state.submissions.filter((s) => {
      if (verdict !== "all" && s.verdict !== verdict) return false;
      if (problem !== "all" && s.problemId !== problem) return false;
      if (lang !== "all" && s.language !== lang) return false;
      if (q) {
        const p = state.participants.find((x) => x.id === s.participantId);
        if (!p?.handle.toLowerCase().includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [state.submissions, state.participants, q, verdict, problem, lang]);

  const languages = ["C++", "Python", "Java", "JavaScript", "Go", "Rust"];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Submissions"
        description={`${filtered.length} submissions · live stream ${state.feedPaused ? "paused" : "running"}`}
      />

      <div className="surface-card p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1.5fr)_repeat(3,auto)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by handle…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={verdict} onValueChange={setVerdict}>
            <SelectTrigger className="w-full md:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All verdicts</SelectItem>
              {["AC","WA","TLE","RE","CE","MLE"].map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={problem} onValueChange={setProblem}>
            <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All problems</SelectItem>
              {state.problems.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-full md:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="hidden grid-cols-[auto_minmax(0,1.5fr)_minmax(0,1fr)_auto_auto_auto_auto] gap-3 border-b border-border px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground md:grid">
          <div>Verdict</div>
          <div>Participant</div>
          <div>Problem</div>
          <div>Lang</div>
          <div>Time</div>
          <div>Submitted</div>
          <div className="text-right">Action</div>
        </div>
        <ul className="divide-y divide-border">
          {filtered.slice(0, 80).map((s) => {
            const p = state.participants.find((x) => x.id === s.participantId);
            const prob = state.problems.find((x) => x.id === s.problemId);
            return (
              <li
                key={s.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-sm md:grid-cols-[auto_minmax(0,1.5fr)_minmax(0,1fr)_auto_auto_auto_auto]"
              >
                <VerdictBadge verdict={s.verdict} />
                <div className="min-w-0">
                  <div className="truncate font-medium">{p?.handle}</div>
                  <div className="truncate text-[11px] text-muted-foreground md:hidden">
                    {prob?.code} · {s.language}
                  </div>
                </div>
                <div className="hidden min-w-0 md:block">
                  <div className="truncate font-mono text-xs">{prob?.code}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{prob?.title}</div>
                </div>
                <div className="hidden font-mono text-xs text-muted-foreground md:block">{s.language}</div>
                <div className="hidden font-mono text-xs tabular-nums text-muted-foreground md:block">{s.runtimeMs}ms</div>
                <div className="hidden text-[11px] text-muted-foreground md:block">{fmtRelative(s.submittedAt)}</div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs"
                    onClick={() => {
                      dispatch({ type: "REJUDGE", id: s.id });
                      toast.message(`Rejudging ${s.id}…`);
                    }}
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Rejudge</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No submissions match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
