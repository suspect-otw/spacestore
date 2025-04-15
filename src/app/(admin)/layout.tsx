import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";

// Create server component to fetch user data once
async function AdminAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Get session for server-side validation
  const { data: { user } } = await supabase.auth.getUser();

  // If no session, redirect immediately
  if (!user) redirect("/login");

  // Fetch profile from server-side
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // If no profile or not admin, redirect
  if (!profile || profile.role !== "admin") redirect("/login");

  // Pass user data to client through search params to avoid multiple fetches
  const userData = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || "Admin",
    avatar: user.user_metadata?.avatar_url || "",
    role: profile.role
  };

  return (
    <>
      <script
        id="admin-user-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(userData)
        }}
      />
      {children}
    </>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AdminAuthWrapper>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <SiteHeader />
            <div className="flex-1 p-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminAuthWrapper>
  );
}
