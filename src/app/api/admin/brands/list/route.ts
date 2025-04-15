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
    
    // Get page and limit from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const searchQuery = searchParams.get('q') || '';
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Create base query to list brands with pagination
    let brandsQuery = supabase
      .from("brands")
      .select("id, brand_name", { count: 'exact' })
      .order("brand_name", { ascending: true });
    
    // Add search filter if provided
    if (searchQuery.trim()) {
      brandsQuery = brandsQuery.ilike("brand_name", `%${searchQuery.trim()}%`);
    }
    
    // Add pagination
    brandsQuery = brandsQuery.range(offset, offset + limit - 1);
    
    // Execute query
    const { data, error, count } = await brandsQuery;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Calculate total pages
    const totalPages = Math.ceil((count || 0) / limit);
    
    return NextResponse.json({ 
      data, 
      count, 
      page, 
      limit, 
      totalPages 
    });
  } catch (error) {
    console.error("Error in brands list API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
