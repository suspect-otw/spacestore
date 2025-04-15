"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

// Types for our database tables
type UserProfile = {
  id: string;
  email: string;
  fullname: string;
  phoneNumber: string;
  created_at: string;
  updated_at: string;
  role: "admin" | "staff" | "user";
};

type Brand = {
  id: number;
  brand_name: string;
  created_at: string;
  updated_at: string;
};

type Product = {
  id: number;
  product_name: string;
  product_description: string | null;
  brand_id: number | null;
  created_at: string;
  updated_at: string;
};

type Request = {
  id: string;
  product_id: number | null;
  product_name: string;
  brand_id: number | null;
  brand_name: string;
  quantity: number;
  user_id: string | null;
  full_name: string;
  country: string;
  address: string;
  post_code: string;
  tel_no: string;
  email: string;
  company_name: string | null;
  created_at: string;
  updated_at: string;
  createdby: string | null;
  updatedby: string | null;
  comment: string | null;
  status: string;
};

// User Profiles CRUD Operations
export async function getUsers(page = 1, pageSize = 20, searchQuery?: string, role?: string) {
  try {
    const adminClient = createAdminClient();
    const skip = (page - 1) * pageSize;
    
    // Build the query
    let query = adminClient
      .from("user_profiles")
      .select("*", { count: "exact" });
    
    // Add filters if provided
    if (searchQuery) {
      query = query.or(`fullname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }
    
    if (role) {
      query = query.eq("role", role);
    }
    
    // Get total count for pagination
    const { count, error: countError } = await query;
    
    if (countError) {
      console.error("Error counting users:", countError);
      return { error: countError, data: null, count: 0 };
    }
    
    // Execute the query with pagination
    const { data, error } = await query
      .order("created_at", { ascending: false })
      .range(skip, skip + pageSize - 1);
    
    if (error) {
      console.error("Error fetching users:", error);
      return { error, data: null, count };
    }
    
    return { 
      data, 
      error: null, 
      count,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    console.error("Exception fetching users:", error);
    return { 
      error: new Error("Failed to fetch users"), 
      data: null, 
      count: 0,
      totalPages: 0
    };
  }
}

export async function getUserById(id: string) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching user:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    return { status: "success", data };
  } catch (error) {
    console.error("Exception fetching user:", error);
    return { status: "error", message: "Failed to fetch user", data: null };
  }
}

export async function updateUser(id: string, userData: Partial<UserProfile>) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("user_profiles")
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating user:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    revalidatePath("/admin");
    return { status: "success", data };
  } catch (error) {
    console.error("Exception updating user:", error);
    return { status: "error", message: "Failed to update user", data: null };
  }
}

export async function deleteUser(id: string) {
  try {
    const adminClient = createAdminClient();
    
    const { error } = await adminClient
      .from("user_profiles")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting user:", error);
      return { status: "error", message: error.message };
    }
    
    revalidatePath("/admin");
    return { status: "success" };
  } catch (error) {
    console.error("Exception deleting user:", error);
    return { status: "error", message: "Failed to delete user" };
  }
}

// Brands CRUD Operations
export async function getBrands(page = 1, pageSize = 20, searchQuery?: string) {
  try {
    const adminClient = createAdminClient();
    const skip = (page - 1) * pageSize;
    
    // Build the query
    let query = adminClient
      .from("brands")
      .select("*", { count: "exact" });
    
    // Add search filter if provided
    if (searchQuery) {
      query = query.ilike("brand_name", `%${searchQuery}%`);
    }
    
    // Get total count for pagination
    const { count, error: countError } = await query;
    
    if (countError) {
      console.error("Error counting brands:", countError);
      return { error: countError, data: null, count: 0 };
    }
    
    // Execute the query with pagination
    const { data, error } = await query
      .order("brand_name", { ascending: true })
      .range(skip, skip + pageSize - 1);
    
    if (error) {
      console.error("Error fetching brands:", error);
      return { error, data: null, count };
    }
    
    return { 
      data, 
      error: null, 
      count,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    console.error("Exception fetching brands:", error);
    return { 
      error: new Error("Failed to fetch brands"), 
      data: null, 
      count: 0,
      totalPages: 0
    };
  }
}

export async function getBrandById(id: number) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("brands")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching brand:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    return { status: "success", data };
  } catch (error) {
    console.error("Exception fetching brand:", error);
    return { status: "error", message: "Failed to fetch brand", data: null };
  }
}

export async function createBrand(brandData: { brand_name: string }) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("brands")
      .insert({
        brand_name: brandData.brand_name,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating brand:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    revalidatePath("/admin");
    return { status: "success", data };
  } catch (error) {
    console.error("Exception creating brand:", error);
    return { status: "error", message: "Failed to create brand", data: null };
  }
}

export async function updateBrand(id: number, brandData: { brand_name: string }) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("brands")
      .update({
        brand_name: brandData.brand_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating brand:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    revalidatePath("/admin");
    return { status: "success", data };
  } catch (error) {
    console.error("Exception updating brand:", error);
    return { status: "error", message: "Failed to update brand", data: null };
  }
}

export async function deleteBrand(id: number) {
  try {
    const adminClient = createAdminClient();
    
    const { error } = await adminClient
      .from("brands")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting brand:", error);
      return { status: "error", message: error.message };
    }
    
    revalidatePath("/admin");
    return { status: "success" };
  } catch (error) {
    console.error("Exception deleting brand:", error);
    return { status: "error", message: "Failed to delete brand" };
  }
}

// Products CRUD Operations
export async function getProducts(page = 1, pageSize = 10, searchQuery?: string, brandId?: number) {
  try {
    const adminClient = createAdminClient();
    const skip = (page - 1) * pageSize;
    
    // Build the query
    let query = adminClient
      .from("products")
      .select(`
        *,
        brands (
          id,
          brand_name
        )
      `, { count: "exact" });
    
    // Add filters if provided
    if (searchQuery) {
      query = query.ilike("product_name", `%${searchQuery}%`);
    }
    
    if (brandId) {
      query = query.eq("brand_id", brandId);
    }
    
    // Get total count for pagination
    const { count, error: countError } = await adminClient
      .from("products")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Error counting products:", countError);
      return { error: countError, data: null, count: 0 };
    }
    
    // Execute the query with pagination
    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .range(skip, skip + pageSize - 1);
    
    if (error) {
      console.error("Error fetching products:", error);
      return { error, data: null, count };
    }
    
    return { 
      data, 
      error: null, 
      count,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    console.error("Exception fetching products:", error);
    return { 
      error: new Error("Failed to fetch products"), 
      data: null, 
      count: 0,
      totalPages: 0
    };
  }
}

export async function getProductById(id: number) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("products")
      .select(`
        *,
        brands (
          id,
          brand_name
        )
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching product:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    return { status: "success", data };
  } catch (error) {
    console.error("Exception fetching product:", error);
    return { status: "error", message: "Failed to fetch product", data: null };
  }
}

export async function createProduct(productData: { 
  product_name: string; 
  product_description?: string; 
  brand_id?: number;
}) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("products")
      .insert({
        product_name: productData.product_name,
        product_description: productData.product_description || null,
        brand_id: productData.brand_id || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating product:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    revalidatePath("/admin");
    return { status: "success", data };
  } catch (error) {
    console.error("Exception creating product:", error);
    return { status: "error", message: "Failed to create product", data: null };
  }
}

export async function updateProduct(id: number, productData: {
  product_name?: string;
  product_description?: string | null;
  brand_id?: number | null;
}) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("products")
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating product:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    revalidatePath("/admin");
    return { status: "success", data };
  } catch (error) {
    console.error("Exception updating product:", error);
    return { status: "error", message: "Failed to update product", data: null };
  }
}

export async function deleteProduct(id: number) {
  try {
    const adminClient = createAdminClient();
    
    const { error } = await adminClient
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting product:", error);
      return { status: "error", message: error.message };
    }
    
    revalidatePath("/admin");
    return { status: "success" };
  } catch (error) {
    console.error("Exception deleting product:", error);
    return { status: "error", message: "Failed to delete product" };
  }
}

// Requests CRUD Operations
export async function getRequests(page = 1, pageSize = 20, searchQuery?: string, status?: string) {
  try {
    const adminClient = createAdminClient();
    const skip = (page - 1) * pageSize;
    
    // Build the query
    let query = adminClient
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
    
    // Add filters if provided
    if (searchQuery) {
      query = query.or(`
        product_name.ilike.%${searchQuery}%,
        brand_name.ilike.%${searchQuery}%,
        full_name.ilike.%${searchQuery}%,
        email.ilike.%${searchQuery}%
      `);
    }
    
    if (status) {
      query = query.eq("status", status);
    }
    
    // Get total count for pagination
    const { count, error: countError } = await query;
    
    if (countError) {
      console.error("Error counting requests:", countError);
      return { error: countError, data: null, count: 0 };
    }
    
    // Execute the query with pagination
    const { data, error } = await query
      .order("created_at", { ascending: false })
      .range(skip, skip + pageSize - 1);
    
    if (error) {
      console.error("Error fetching requests:", error);
      return { error, data: null, count };
    }
    
    return { 
      data, 
      error: null, 
      count,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    console.error("Exception fetching requests:", error);
    return { 
      error: new Error("Failed to fetch requests"), 
      data: null, 
      count: 0,
      totalPages: 0
    };
  }
}

export async function getRequestById(id: string) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
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
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching request:", error);
      return { error, data: null };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Exception fetching request:", error);
    return { 
      error: new Error("Failed to fetch request"), 
      data: null
    };
  }
}

export async function updateRequest(id: string, requestData: Partial<Request>, updatedBy: string) {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from("requests")
      .update({
        ...requestData,
        updatedby: updatedBy,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating request:", error);
      return { status: "error", message: error.message, data: null };
    }
    
    revalidatePath("/admin");
    return { status: "success", data };
  } catch (error) {
    console.error("Exception updating request:", error);
    return { status: "error", message: "Failed to update request", data: null };
  }
}

export async function deleteRequest(id: string) {
  try {
    const adminClient = createAdminClient();
    
    const { error } = await adminClient
      .from("requests")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting request:", error);
      return { status: "error", message: error.message };
    }
    
    revalidatePath("/admin");
    return { status: "success" };
  } catch (error) {
    console.error("Exception deleting request:", error);
    return { status: "error", message: "Failed to delete request" };
  }
}
