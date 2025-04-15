import { Suspense } from "react"
import { getBrands } from "@/actions/admin"
import { BrandsTable } from "@/components/admin/BrandsTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search } from "lucide-react"
import Pagination from "@/components/Pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BrandsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

export default async function BrandsPage({ searchParams: searchParamsProp }: BrandsPageProps) {
  // Await the promise to get the actual searchParams
  const searchParams = await searchParamsProp;
  
  // Now safely access the properties
  const currentPage = Number(searchParams.page || '1');
  const searchQuery = searchParams.q || "";
  const brandsPerPage = Number(process.env.BRANDS_PER_PAGE) || 20;
  
  const { data: brandsData, error, count, totalPages } = await getBrands(
    currentPage, 
    brandsPerPage, 
    searchQuery
  );
  
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Brands Management</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load brands: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Calculate actual total pages based on count and brandsPerPage
  const actualTotalPages = Math.max(1, Math.ceil((count || 0) / brandsPerPage));
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Brands Management</h1>
        <p className="text-sm text-muted-foreground">
          {count} total brands {searchQuery ? `matching "${searchQuery}"` : ''}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-auto flex-1">
          <form action="/admin/brands" className="flex items-center gap-2">
            <Input 
              name="q"
              placeholder="Search brands..." 
              defaultValue={searchQuery}
              className="max-w-sm"
            />
            <Button type="submit" size="default">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>
      
      <Suspense fallback={<div>Loading brands...</div>}>
        <div className="rounded-md border overflow-hidden">
          <BrandsTable brands={brandsData || []} />
        </div>
      </Suspense>
      
      {actualTotalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={actualTotalPages}
          basePath="/admin/brands"
          queryParams={searchQuery ? { q: searchQuery } : {}}
        />
      )}
    </div>
  );
}
