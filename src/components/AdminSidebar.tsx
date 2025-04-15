"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  ClipboardList, 
  Home,
  LogOut
} from "lucide-react";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { signOut } from "@/actions/auth";

export default function AdminSidebar({ 
  user,
  children 
}: { 
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b px-6 py-3">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your store</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/admin")}
              >
                <Link href="/admin">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/admin/users")}
              >
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/admin/brands")}
              >
                <Link href="/admin/brands">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>Brands</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/admin/products")}
              >
                <Link href="/admin/products">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/admin/requests")}
              >
                <Link href="/admin/requests">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Requests</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <form action={signOut}>
              <button 
                type="submit"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </SidebarFooter>
        <SidebarTrigger />
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </>
  );
}
