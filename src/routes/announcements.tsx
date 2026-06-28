import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useContest } from "@/lib/contest-store";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pin, PinOff, Trash2, Megaphone, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtRelative } from "@/lib/format";
import type { Announcement } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements · Contest Control Center" },
      { name: "description", content: "Broadcast clarifications, alerts, and judge notices to all participants." },
    ],
  }),
  component: AnnouncementsPage,
});

const sevIcon = {
  info: { Icon: Info, cls: "bg-info/15 text-info border-info/30" },
  warning: { Icon: AlertTriangle, cls: "bg-warning/15 text-warning border-warning/30" },
  critical: { Icon: AlertTriangle, cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

function AnnouncementsPage() {
  const { state, dispatch, addAnnouncement } = useContest();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState<Announcement["severity"]>("info");

  const sorted = [...state.announcements].sort((a, b) => {
    if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  function publish() {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    addAnnouncement({ title: title.trim(), body: body.trim(), severity });
    setTitle("");
    setBody("");
    setSeverity("info");
    toast.success("Announcement broadcast");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Announcements"
        description="Broadcast updates, clarifications, and alerts to every participant."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          {sorted.map((a) => {
            const { Icon, cls } = sevIcon[a.severity];
            return (
              <div
                key={a.id}
                className={cn(
                  "surface-card grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 p-4",
                  a.pinned && "ring-1 ring-primary/40",
                )}
              >
                <div className={cn("grid h-9 w-9 place-items-center rounded-md border", cls)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate font-semibold">{a.title}</h4>
                    {a.pinned && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                  <div className="mt-2 text-[11px] text-muted-foreground">{fmtRelative(a.createdAt)}</div>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => dispatch({ type: "PIN_ANNOUNCEMENT", id: a.id })}
                  >
                    {a.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => dispatch({ type: "REMOVE_ANNOUNCEMENT", id: a.id })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="surface-card px-4 py-10 text-center text-sm text-muted-foreground">
              No announcements yet.
            </div>
          )}
        </div>

        <div className="surface-card h-fit p-5">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">New announcement</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judge restart in 5 min" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Body</label>
              <Textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Brief details for participants…"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Severity</label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as Announcement["severity"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={publish} className="w-full">Broadcast</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
