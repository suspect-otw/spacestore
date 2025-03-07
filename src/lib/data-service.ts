import { supabaseServer } from '../utils/supabase/server';
import { Brand, Product } from '../types';
import { cache } from 'react';
import { getBrandImagePlaceholder, getProductImagePlaceholder } from '../utils/image-utils';

// Define types for Supabase models based on our schema
type SupabaseBrand = {
  id: number;
  brand_name: string;
  is_scraped: boolean;
  scrape_notes: string | null;
};

type SupabaseProduct = {
  id: number;
  brand_id: number;
  product_name: string;
  product_description: string | null;
};

// Pagination defaults
const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_PAGE = 1;

// Helper function to map Supabase Brand to our frontend Brand type
function mapSupabaseBrandToFrontend(supabaseBrand: SupabaseBrand): Brand {
  // Use brand_name directly
  const brandName = supabaseBrand.brand_name;
  
  // Clean brand name (remove www. if present)
  let cleanBrandName = brandName.replace(/^www\./i, '');
  
  // Special case for ABC brand
  if (supabaseBrand.id === 15083 || cleanBrandName.includes('ABC(Anglo Belgian Corporation)')) {
    cleanBrandName = 'Anglo Belgian Corporation ABC';
  }
  
  // Generate a dynamic brand image placeholder
  const brandImage = getBrandImagePlaceholder(cleanBrandName, 400, 300);
  
  return {
    brandId: supabaseBrand.id,
    brandName: cleanBrandName,
    brandImage: brandImage, // Use dynamic placeholder image
    brandDescription: `${cleanBrandName} is a leading manufacturer in their industry.`, // Default description
    brandWebsite: `https://${cleanBrandName.toLowerCase().replace(/\s+/g, '')}.com`, // Simple website URL based on brand name
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system'
  };
}

// Helper function to map Supabase Product to our frontend Product type
function mapSupabaseProductToFrontend(supabaseProduct: SupabaseProduct): Product {
  // Get the product name
  const productName = supabaseProduct.product_name;
  
  // Generate a dynamic product image placeholder
  const productImage = getProductImagePlaceholder(productName, 400, 300);
  
  return {
    productId: supabaseProduct.id,
    brandId: supabaseProduct.brand_id,
    productName: productName,
    productDescription: supabaseProduct.product_description || '',
    productImage: productImage, // Use dynamic placeholder image
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system'
  };
}

// Get all brands with pagination
export const getAllBrands = cache(async (page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    const skip = (page - 1) * pageSize;
    
    // Get brands with pagination
    const { data: brands, error: brandsError } = await supabaseServer
      .from('brands')
      .select('*')
      .order('id', { ascending: true })
      .range(skip, skip + pageSize - 1);
    
    if (brandsError) throw brandsError;
    
    // Get total count for pagination
    const { count: totalBrands, error: countError } = await supabaseServer
      .from('brands')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    return {
      brands: brands.map(mapSupabaseBrandToFrontend),
      totalBrands: totalBrands || 0,
      totalPages: Math.ceil((totalBrands || 0) / pageSize)
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
});

// Get brand by ID
export const getBrandById = cache(async (brandId: number) => {
  try {
    const { data: brand, error } = await supabaseServer
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();
    
    if (error) throw error;
    if (!brand) return null;
    
    return mapSupabaseBrandToFrontend(brand);
  } catch (error) {
    console.error(`Error fetching brand with ID ${brandId}:`, error);
    return null;
  }
});

// Get brand by name
export const getBrandByName = cache(async (brandName: string) => {
  try {
    // Decode the URL-encoded brand name
    const decodedBrandName = decodeURIComponent(brandName);
    
    // First try: Find by exact brand_name match
    const { data: exactBrands, error: exactError } = await supabaseServer
      .from('brands')
      .select('*')
      .eq('brand_name', decodedBrandName);
    
    if (exactError) throw exactError;
    
    if (exactBrands && exactBrands.length > 0) {
      return mapSupabaseBrandToFrontend(exactBrands[0]);
    }
    
    // Second try: Find by case-insensitive exact match
    const { data: caseInsensitiveBrands, error: caseError } = await supabaseServer
      .from('brands')
      .select('*')
      .ilike('brand_name', decodedBrandName);
    
    if (caseError) throw caseError;
    
    if (caseInsensitiveBrands && caseInsensitiveBrands.length > 0) {
      return mapSupabaseBrandToFrontend(caseInsensitiveBrands[0]);
    }
    
    // Third try: Find by partial match
    const { data: partialBrands, error: partialError } = await supabaseServer
      .from('brands')
      .select('*')
      .ilike('brand_name', `%${decodedBrandName}%`);
    
    if (partialError) throw partialError;
    
    if (partialBrands && partialBrands.length > 0) {
      return mapSupabaseBrandToFrontend(partialBrands[0]);
    }
    
    // No matches found
    return null;
  } catch (error) {
    console.error(`Error fetching brand with name ${brandName}:`, error);
    return null;
  }
});

// Get products by brand ID with pagination
export const getProductsByBrandId = cache(async (brandId: number, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    const skip = (page - 1) * pageSize;
    
    // Get products with pagination
    const { data: products, error: productsError } = await supabaseServer
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .order('id', { ascending: true })
      .range(skip, skip + pageSize - 1);
    
    if (productsError) throw productsError;
    
    // Get total count for pagination
    const { count: totalProducts, error: countError } = await supabaseServer
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brandId);
    
    if (countError) throw countError;
    
    return {
      products: products.map(mapSupabaseProductToFrontend),
      totalProducts: totalProducts || 0,
      totalPages: Math.ceil((totalProducts || 0) / pageSize)
    };
  } catch (error) {
    console.error(`Error fetching products for brand ID ${brandId}:`, error);
    throw error;
  }
});

// Get product by ID
export const getProductById = cache(async (productId: number) => {
  try {
    const { data: product, error } = await supabaseServer
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    if (!product) return null;
    
    return mapSupabaseProductToFrontend(product);
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    return null;
  }
});

// Search brands and products with pagination
export const searchBrandsAndProducts = cache(async (query: string, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    const skip = (page - 1) * pageSize;
    
    // Search brands
    const { data: brands, error: brandsError } = await supabaseServer
      .from('brands')
      .select('*')
      .or(`brand_name.ilike.%${query}%`)
      .order('id', { ascending: true })
      .range(skip, skip + pageSize - 1);
    
    if (brandsError) throw brandsError;
    
    // Get total brands count for pagination
    const { count: totalBrands, error: brandsCountError } = await supabaseServer
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .or(`brand_name.ilike.%${query}%`);
    
    if (brandsCountError) throw brandsCountError;
    
    // Search products
    const { data: products, error: productsError } = await supabaseServer
      .from('products')
      .select('*, brands!inner(*)')
      .or(`product_name.ilike.%${query}%,product_description.ilike.%${query}%`)
      .order('id', { ascending: true })
      .range(skip, skip + pageSize - 1);
    
    if (productsError) throw productsError;
    
    // Get total products count for pagination
    const { count: totalProducts, error: productsCountError } = await supabaseServer
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or(`product_name.ilike.%${query}%,product_description.ilike.%${query}%`);
    
    if (productsCountError) throw productsCountError;
    
    // Map products with their brands
    const productsWithBrands = products.map(product => ({
      product: mapSupabaseProductToFrontend(product),
      brand: mapSupabaseBrandToFrontend(product.brands)
    }));
    
    return {
      brands: brands.map(mapSupabaseBrandToFrontend),
      productsWithBrands,
      totalBrands: totalBrands || 0,
      totalProducts: totalProducts || 0,
      totalBrandPages: Math.ceil((totalBrands || 0) / pageSize),
      totalProductPages: Math.ceil((totalProducts || 0) / pageSize)
    };
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    throw error;
  }
}); 