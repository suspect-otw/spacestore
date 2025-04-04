import { getRole, getUserSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  const response = await getUserSession();
  if(response?.user){
    const role = await getRole();
    if (role === "admin") {
      redirect("/admin");
    } else if (role === "staff") {
      redirect("/staff"); // Assuming you have a /staff route
    } else if (role === "user") {
      redirect("/dashboard"); // Assuming you have a /dashboard route
    } else {
      console.error("Unexpected user role:", role);
      redirect("/login");
    }
  }
  return <>{children}</>;
}