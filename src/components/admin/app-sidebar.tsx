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
import { useEffect, useState } from "react"
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
  const [userData, setUserData] = useState<{
    name: string,
    email: string,
    avatar: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  // Get user data from the layout script tag
  useEffect(() => {
    console.log('[AppSidebar] Looking for admin-user-data script tag');
    const scriptTag = document.getElementById('admin-user-data')
    if (scriptTag) {
      try {
        console.log('[AppSidebar] Script tag found, parsing data');
        const data = JSON.parse(scriptTag.textContent || '{}')
        console.log('[AppSidebar] Admin user data parsed:', data);
        setUserData({
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || ''
        })
        console.log('[AppSidebar] User data set for sidebar:', {
          name: data.name || '',
          email: data.email || '',
          avatar: Boolean(data.avatar)
        });
      } catch (error) {
        console.error('[AppSidebar] Error parsing user data:', error)
      }
    } else {
      console.warn('[AppSidebar] admin-user-data script tag not found!');
    }
    setLoading(false)
  }, [])
  
  // Handle logout using the server action
  const handleLogout = async () => {
    console.log('[AppSidebar] Logging out user');
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
        {loading ? (
          <div className="flex items-center space-x-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ) : userData ? (
          <NavUser user={userData} onLogout={handleLogout} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  )
}
