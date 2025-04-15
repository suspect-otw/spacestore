"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNavAuth } from "@/components/user-nav-auth"

export function SiteHeader() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {isAdmin && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </>
        )}
        <h1 className="text-base font-medium">
          {isAdmin ? "Admin Dashboard" : "Space Store One"}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserNavAuth />
        </div>
      </div>
    </header>
  )
}
