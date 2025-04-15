import { Suspense } from "react"
import { getUsers } from "@/actions/admin"
import { UsersTable } from "@/components/admin/UsersTable"
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

interface UsersPageProps {
  searchParams: Promise<{ 
    q?: string;
    page?: string;
    role?: string;
  }>;
}

export default async function UsersPage({ searchParams: searchParamsProp }: UsersPageProps) {
  // Await the promise to get the actual searchParams
  const searchParams = await searchParamsProp;
  
  // Now safely access the properties
  const currentPage = Number(searchParams.page || '1');
  const searchQuery = searchParams.q || "";
  const role = searchParams.role && searchParams.role !== 'all' ? searchParams.role : undefined;
  const usersPerPage = 20;
  
  const { data: usersData, error, count, totalPages } = await getUsers(
    currentPage, 
    usersPerPage, 
    searchQuery,
    role
  );
  
  // Calculate actual total pages based on count and usersPerPage
  const actualTotalPages = Math.max(1, Math.ceil((count || 0) / usersPerPage));
  
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load users: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-sm text-muted-foreground">
          {count} total users 
          {searchQuery ? ` matching "${searchQuery}"` : ''} 
          {role ? ` with role "${role}"` : ''}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-auto flex-1">
          <form action="/admin/users" className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input 
              name="q"
              placeholder="Search users..." 
              defaultValue={searchQuery}
              className="max-w-sm"
            />
            
            <div className="w-full sm:w-auto">
              <Select name="role" defaultValue={role || 'all'}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
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
      
      <Suspense fallback={<div>Loading users...</div>}>
        <div className="rounded-md border overflow-hidden">
          <UsersTable users={usersData || []} />
        </div>
      </Suspense>
      
      {actualTotalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={actualTotalPages}
          basePath="/admin/users"
          queryParams={{
            ...(searchQuery ? { q: searchQuery } : {}),
            ...(role ? { role } : {})
          }}
        />
      )}
    </div>
  );
}
