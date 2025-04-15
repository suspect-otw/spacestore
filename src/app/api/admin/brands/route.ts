import { NextResponse } from "next/server";
import { getBrands } from "@/actions/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and has admin role
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch profile to check role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
    
    // Get all brands for dropdown (no pagination needed)
    const { data, error, count } = await getBrands(1, 1000);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data, count });
  } catch (error) {
    console.error("Error in brands API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
