"use server";

import { createAdminClient } from "@/utils/supabase/admin";

// Search users with pagination and filtering
export async function searchUsers(query: string, page = 1, limit = 10, role?: string) {
  try {
    const adminClient = createAdminClient();
    const skip = (page - 1) * limit;
    
    // Build the query
    let dbQuery = adminClient
      .from("user_profiles")
      .select("*", { count: "exact" });
    
    // Apply search filter if query is provided
    if (query) {
      dbQuery = dbQuery.or(`fullname.ilike.%${query}%,email.ilike.%${query}%`);
    }
    
    // Apply role filter if provided
    if (role && role !== 'all') {
      dbQuery = dbQuery.eq('role', role);
    }
    
    // Get count for pagination
    const { count, error: countError } = await dbQuery;
    
    if (countError) {
      console.error("Error counting users:", countError);
      return { 
        error: countError.message, 
        data: null, 
        count: 0,
        totalPages: 0 
      };
    }
    
    // Execute the query with pagination
    const { data, error } = await dbQuery
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);
    
    if (error) {
      console.error("Error searching users:", error);
      return { 
        error: error.message, 
        data: null, 
        count,
        totalPages: 0 
      };
    }
    
    // Calculate total pages
    const totalPages = Math.ceil((count || 0) / limit);
    
    // Return the results
    return {
      data,
      count,
      page,
      limit,
      totalPages,
      error: null
    };
  } catch (error: any) {
    console.error("Exception in users search:", error);
    return {
      data: null,
      count: 0,
      page,
      limit,
      totalPages: 0,
      error: error.message || "Failed to search users"
    };
  }
}

// Search requests with pagination and filtering
export async function searchRequests(query: string, page = 1, limit = 10, status?: string) {
  try {
    const adminClient = createAdminClient();
    const skip = (page - 1) * limit;
    
    // Build the query
    let dbQuery = adminClient
      .from("requests")
      .select(`
        *,
        products (
          id,
          product_name
        ),
        brands (
          id,
          brand_name
        ),
        user_profiles!requests_user_id_fkey (
          id,
          fullname,
          email
        )
      `, { count: "exact" });
    
    // Apply search filter if query is provided
    if (query) {
      dbQuery = dbQuery.or(`
        product_name.ilike.%${query}%,
        brand_name.ilike.%${query}%,
        full_name.ilike.%${query}%,
        email.ilike.%${query}%
      `);
    }
    
    // Apply status filter if provided
    if (status && status !== 'all') {
      dbQuery = dbQuery.eq('status', status);
    }
    
    // Get count for pagination
    const { count, error: countError } = await dbQuery;
    
    if (countError) {
      console.error("Error counting requests:", countError);
      return { 
        error: countError.message, 
        data: null, 
        count: 0,
        totalPages: 0 
      };
    }
    
    // Execute the query with pagination
    const { data, error } = await dbQuery
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);
    
    if (error) {
      console.error("Error searching requests:", error);
      return { 
        error: error.message, 
        data: null, 
        count,
        totalPages: 0 
      };
    }
    
    // Calculate total pages
    const totalPages = Math.ceil((count || 0) / limit);
    
    // Return the results
    return {
      data,
      count,
      page,
      limit,
      totalPages,
      error: null
    };
  } catch (error: any) {
    console.error("Exception in requests search:", error);
    return {
      data: null,
      count: 0,
      page,
      limit,
      totalPages: 0,
      error: error.message || "Failed to search requests"
    };
  }
}
