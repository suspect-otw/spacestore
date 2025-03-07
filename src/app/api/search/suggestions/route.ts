import { NextRequest, NextResponse } from 'next/server';
import { searchBrandsAndProducts } from '@/lib/data-service';

export async function GET(request: NextRequest) {
  try {
    // Get the search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    // If no query is provided, return empty results
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        brands: [], 
        products: [] 
      });
    }
    
    // Search for brands and products using the data service
    // Limit to 5 results each for the dropdown
    const results = await searchBrandsAndProducts(query.trim(), 1, 5);
    
    // Return the results
    return NextResponse.json({
      brands: results.brands.slice(0, 5),
      products: results.productsWithBrands.slice(0, 5)
    });
  } catch (error) {
    console.error('Error in search suggestions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search suggestions' },
      { status: 500 }
    );
  }
} 