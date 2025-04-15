import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
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
    
    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Create query to search brands
    let brandsQuery = supabase
      .from("brands")
      .select("id, brand_name", { count: 'exact' })
      .order("brand_name", { ascending: true })
      .limit(limit);
    
    // Add search filter if query is provided
    if (query && query.trim()) {
      brandsQuery = brandsQuery.ilike("brand_name", `%${query.trim()}%`);
    }
    
    // Execute query
    const { data, error, count } = await brandsQuery;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      data, 
      count,
      success: true 
    });
  } catch (error) {
    console.error("Error in brands search API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
