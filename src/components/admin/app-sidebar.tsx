"use client"

import * as React from "react"
import {
  IconBuilding,
  IconCube,
  IconHome,
  IconInnerShadowTop,
  IconScript,
  IconSettings,
  IconUserPentagon,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavSecondary } from "@/components/admin/nav-secondary"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAdminUser } from "@/context/admin-user-context"
import { signOut } from "@/actions/auth"
import { Skeleton } from "@/components/ui/skeleton"

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconHome,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Brands",
      url: "/admin/brands",
      icon: IconBuilding,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconCube,
    },
    {
      title: "Requests",
      url: "/admin/requests",
      icon: IconScript,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/users",
      icon: IconSettings,
    },
    {
      title:"Profile",
      url:"/admin/profile",
      icon:IconUserPentagon,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userData } = useAdminUser()
  
  // Handle logout using the server action
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Space Store One</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {!userData ? (
          <div className="flex items-center space-x-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ) : (
          <NavUser 
            user={{
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar
            }} 
            onLogout={handleLogout} 
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
