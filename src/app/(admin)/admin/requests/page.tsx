import { Suspense } from "react"
import { getRequests } from "@/actions/admin"
import { RequestsTable } from "@/components/admin/RequestsTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search } from "lucide-react"
import Pagination from "@/components/Pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface RequestsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
  }>;
}

export default async function RequestsPage({ searchParams: searchParamsProp }: RequestsPageProps) {
  // Await the promise to get the actual searchParams
  const searchParams = await searchParamsProp;
  
  // Now safely access the properties
  const currentPage = Number(searchParams.page || '1');
  const searchQuery = searchParams.q || "";
  const statusParam = searchParams.status || "";
  // Only pass status to the query if it's not 'all'
  const status = statusParam && statusParam !== 'all' ? statusParam : undefined;
  const requestsPerPage = 20; // You can adjust this or add to environment variables
  
  const { data: requestsData, error, count, totalPages } = await getRequests(
    currentPage, 
    requestsPerPage, 
    searchQuery,
    status
  );
  
  // Calculate actual total pages based on count and requestsPerPage
  const actualTotalPages = Math.max(1, Math.ceil((count || 0) / requestsPerPage));
  
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Requests Management</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load requests: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Requests Management</h1>
        <p className="text-sm text-muted-foreground">
          {count} total requests 
          {searchQuery ? ` matching "${searchQuery}"` : ''} 
          {status ? ` with status "${status}"` : ''}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-auto flex-1">
          <form action="/admin/requests" className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input 
              name="q"
              placeholder="Search requests..." 
              defaultValue={searchQuery}
              className="max-w-sm"
            />
            
            <div className="w-full sm:w-auto">
              <Select name="status" defaultValue={statusParam || 'all'}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" size="default">
              <Search className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </form>
        </div>
      </div>
      
      <Suspense fallback={<div>Loading requests...</div>}>
        <div className="rounded-md border overflow-hidden">
          <RequestsTable requests={requestsData || []} />
        </div>
      </Suspense>
      
      {actualTotalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={actualTotalPages}
          basePath="/admin/requests"
          queryParams={{
            ...(searchQuery ? { q: searchQuery } : {}),
            ...(statusParam && statusParam !== 'all' ? { status: statusParam } : {})
          }}
        />
      )}
    </div>
  );
}
