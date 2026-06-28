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
import { Badge } from "@/components/ui/badge";
import { Search, UserX, UserCheck } from "lucide-react";
import type { Participant } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/participants")({
  head: () => ({
    meta: [
      { title: "Participants · Contest Control Center" },
      { name: "description", content: "Manage registered contest participants, their status and verification." },
    ],
  }),
  component: ParticipantsPage,
});

const statusTone: Record<Participant["status"], string> = {
  active: "bg-success/15 text-success border-success/30",
  idle: "bg-warning/15 text-warning border-warning/30",
  offline: "bg-muted text-muted-foreground border-border",
  disqualified: "bg-destructive/15 text-destructive border-destructive/30",
};

function ParticipantsPage() {
  const { state, dispatch } = useContest();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [college, setCollege] = useState<string>("all");

  const colleges = useMemo(
    () => Array.from(new Set(state.participants.map((p) => p.college))).sort(),
    [state.participants],
  );

  const filtered = useMemo(() => {
    return state.participants.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (college !== "all" && p.college !== college) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!p.handle.toLowerCase().includes(s) && !p.name.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [state.participants, q, status, college]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Participants"
        description={`${filtered.length} of ${state.participants.length} contestants shown`}
      />

      <div className="surface-card p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search handle or name…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="disqualified">Disqualified</SelectItem>
            </SelectContent>
          </Select>
          <Select value={college} onValueChange={setCollege}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All colleges</SelectItem>
              {colleges.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,2fr)_auto_auto_auto_auto] gap-3 border-b border-border px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground md:grid">
          <div>Handle</div>
          <div>College</div>
          <div>Year</div>
          <div>Rating</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-border">
          {filtered.slice(0, 100).map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-sm md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_auto_auto_auto_auto]"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{p.handle}</div>
                <div className="truncate text-[11px] text-muted-foreground">{p.name} · {p.country}</div>
              </div>
              <div className="hidden truncate text-muted-foreground md:block">{p.college}</div>
              <div className="hidden font-mono text-xs tabular-nums md:block">Y{p.year}</div>
              <div className="hidden font-mono text-xs tabular-nums md:block">{p.rating}</div>
              <div>
                <span className={"inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium " + statusTone[p.status]}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {p.status}
                </span>
              </div>
              <div className="flex shrink-0 justify-end gap-1">
                {p.status === "disqualified" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs text-success"
                    onClick={() => {
                      dispatch({ type: "SET_PARTICIPANT_STATUS", id: p.id, status: "active" });
                      toast.success(`${p.handle} reinstated`);
                    }}
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Reinstate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      dispatch({ type: "SET_PARTICIPANT_STATUS", id: p.id, status: "disqualified" });
                      toast.error(`${p.handle} disqualified`);
                    }}
                  >
                    <UserX className="h-3.5 w-3.5" /> DQ
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {filtered.length > 100 && (
          <div className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
            Showing first 100 results · refine filters to narrow down
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No participants match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
