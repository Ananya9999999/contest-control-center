import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Code2,
  Trophy,
  ListChecks,
  Megaphone,
  Settings,
  Activity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useContest } from "@/lib/contest-store";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Participants", url: "/participants", icon: Users },
  { title: "Submissions", url: "/submissions", icon: Code2 },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Problems", url: "/problems", icon: ListChecks },
  { title: "Announcements", url: "/announcements", icon: Megaphone },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const collapsed = sidebarState === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useContest();

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary glow-ring">
            <Activity className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold tracking-tight">CodeChef VIT</div>
              <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
                Control Center
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="px-2 py-2 text-[11px] text-muted-foreground">
            <div className="truncate font-medium text-foreground">{state.config.name}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="status-dot" />
              {state.config.paused ? "Paused" : "Live"}
            </div>
          </div>
        ) : (
          <div className="grid place-items-center py-2">
            <span className="status-dot" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
