import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "@/components/admin/UsersTable";
import { BrandsTable } from "@/components/admin/BrandsTable";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { RequestsTable } from "@/components/admin/RequestsTable";
import { getUsers, getBrands, getProducts, getRequests } from "@/actions/admin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const supabase = await createClient();
  
  // Get session instead of user for server-side validation
  const { data: { user } } = await supabase.auth.getUser();

  // If no session, redirect immediately
  if (!user) redirect("/login");

  // Fetch profile from server-side
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // If no profile or not admin, redirect
  if (!profile || profile.role !== "admin") redirect("/login");

  // Fetch data for all tables
  const usersResponse = await getUsers();
  const brandsResponse = await getBrands();
  const productsResponse = await getProducts();
  const requestsResponse = await getRequests();

  // Get data or empty arrays if there's an error
  const users = usersResponse.data || [];
  const brands = brandsResponse.data || [];
  const products = productsResponse.data || [];
  const requests = requestsResponse.data || [];

  // Check for errors
  const hasErrors = [
    usersResponse.error,
    brandsResponse.error,
    productsResponse.error,
    requestsResponse.error
  ].some(Boolean);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error fetching some data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered users in the system
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandsResponse.count || brands.length}</div>
            <p className="text-xs text-muted-foreground">
              Brands in the database
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/admin/brands">Manage Brands</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsResponse.count || products.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in the database
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/admin/products">Manage Products</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              Customer requests
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/admin/requests">Manage Requests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable users={users} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>
                Manage brands in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrandsTable brands={brands} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage products in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsTable products={products} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Requests</CardTitle>
              <CardDescription>
                Manage customer requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestsTable requests={requests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}