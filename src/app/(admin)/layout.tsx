import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
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

  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
