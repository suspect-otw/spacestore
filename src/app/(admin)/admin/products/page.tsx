import { Suspense } from "react"
import { getProducts } from "@/actions/admin"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search } from "lucide-react"
import Pagination from "@/components/Pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchableBrandSelectWrapper } from "@/components/admin/SearchableBrandSelectWrapper"
import { ProductsTableWrapper } from "@/components/admin/ProductsTableWrapper"

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    brandId?: string;
  }>;
}

export default async function ProductsPage({ searchParams: searchParamsProp }: ProductsPageProps) {
  // Await the promise to get the actual searchParams
  const searchParams = await searchParamsProp;
  
  // Now safely access the properties
  const currentPage = Number(searchParams.page || '1');
  const searchQuery = searchParams.q || "";
  const brandIdParam = searchParams.brandId || "";
  // Only pass brandId to the query if it's a valid number and not 'all'
  const brandId = brandIdParam && brandIdParam !== 'all' ? Number(brandIdParam) : undefined;
  const productsPerPage = Number(process.env.PRODUCTS_PER_PAGE) || 10;
  
  // Fetch products with pagination and filters
  const { data: productsData, error, count, totalPages } = await getProducts(
    currentPage, 
    productsPerPage, 
    searchQuery,
    brandId
  );
  
  // Calculate actual total pages based on count and productsPerPage
  const actualTotalPages = Math.max(1, Math.ceil((count || 0) / productsPerPage));
  
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <p className="text-sm text-muted-foreground">
          {count} total products {brandId ? 'for selected brand' : ''}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-auto flex-1">
          <form action="/admin/products" className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input 
              name="q"
              placeholder="Search products..." 
              defaultValue={searchQuery}
              className="max-w-sm"
            />
            
            <div className="w-full sm:w-auto">
              <SearchableBrandSelectWrapper 
                defaultValue={brandIdParam || 'all'} 
                name="brandId"
              />
            </div>
            
            <Button type="submit" size="default">
              <Search className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </form>
        </div>
      </div>
      
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : (
        <Suspense fallback={<div>Loading products...</div>}>
          <div className="rounded-md border overflow-hidden">
            <ProductsTableWrapper 
              products={productsData || []} 
            />
          </div>
        </Suspense>
      )}
      
      {actualTotalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={actualTotalPages}
          basePath="/admin/products"
          queryParams={{
            ...(searchQuery ? { q: searchQuery } : {}),
            ...(brandIdParam && brandIdParam !== 'all' ? { brandId: brandIdParam } : {})
          }}
        />
      )}
    </div>
  );
}
