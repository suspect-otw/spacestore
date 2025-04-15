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
import { cache } from "react";

// Create cached version of user auth to prevent duplicate requests
const getAdminUser = cache(async () => {
  const supabase = await createClient();
  
  // Get session for server-side validation
  const { data: { user } } = await supabase.auth.getUser();

  // If no session, return null
  if (!user) {
    console.log("[Admin Layout] No user found, redirecting to login");
    return null;
  }

  // Server-side log
  console.log("[Admin Layout] User authenticated:", {
    id: user.id,
    email: user.email,
    metadata: user.user_metadata
  });

  // Fetch profile from server-side
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Server-side log
  console.log("[Admin Layout] User profile:", profile);

  // If no profile or not admin, return null
  if (!profile || profile.role !== "admin") {
    console.log("[Admin Layout] User not admin", { role: profile?.role });
    return null;
  }

  // Return user data
  const userData = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.fullname || "Admin",
    avatar: user.user_metadata?.avatar_url || "",
    role: profile.role
  };

  console.log("[Admin Layout] Admin authenticated successfully:", userData);
  return userData;
});

// Create server component to fetch user data once
async function AdminAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getAdminUser();
  
  // If no user data, redirect to login
  if (!userData) {
    redirect("/login");
  }

  return (
    <>
      <script
        id="admin-user-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(userData)
        }}
      />
      {/* Add client-side debug logger */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const userData = JSON.parse(document.getElementById('admin-user-data').textContent || '{}');
                console.log('%c🔐 Admin User Data:', 'background: #4285F4; color: white; padding: 2px 5px; border-radius: 3px;', userData);
                console.log('%c👤 User Role:', 'background: #0F9D58; color: white; padding: 2px 5px; border-radius: 3px;', userData.role);
                console.log('%c📧 User Email:', 'background: #DB4437; color: white; padding: 2px 5px; border-radius: 3px;', userData.email);
              } catch (e) {
                console.error('Error displaying admin data:', e);
              }
            })();
          `
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
