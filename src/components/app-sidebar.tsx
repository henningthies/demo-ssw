import * as React from "react"
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  ListOrdered,
  Settings2,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Henning Thies",
    email: "h.thies@ssw-group.com",
    avatar: "",
  },
  teams: [
    {
      name: "SSW Trading",
      logo: TrendingUp,
      plan: "Internal Tools",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Trading",
      url: "#",
      icon: BarChart3,
      items: [
        { title: "Blotter", url: "/trades" },
        { title: "New Trade", url: "/trades/new" },
        { title: "Positions", url: "/positions" },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ListOrdered,
      items: [
        { title: "Open Orders", url: "/orders" },
        { title: "Order History", url: "/orders/history" },
      ],
    },
    {
      title: "Risk & Compliance",
      url: "#",
      icon: FileText,
      items: [
        { title: "Risk Overview", url: "/risk" },
        { title: "Limits", url: "/risk/limits" },
        { title: "Reports", url: "/risk/reports" },
      ],
    },
    {
      title: "Accounts",
      url: "#",
      icon: Wallet,
      items: [
        { title: "Portfolios", url: "/accounts" },
        { title: "Counterparties", url: "/accounts/counterparties" },
      ],
    },
    {
      title: "Admin",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Users", url: "/admin/users" },
        { title: "Instruments", url: "/admin/instruments" },
        { title: "Settings", url: "/admin/settings" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
