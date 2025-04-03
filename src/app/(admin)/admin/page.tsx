import ClientComponent from "@/components/ClientComponent";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  
  // Get session instead of user for server-side validation
  const { data: { session } } = await supabase.auth.getSession();

  // If no session, redirect immediately
  if (!session) redirect("/login");

  // Fetch profile from server-side
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // If no profile or not admin, redirect
  if (!profile || profile.role !== "admin") redirect("/login");

  // Pass user data to client component
  return <ClientComponent user={session.user} />;
}