import { getRole, getUserSession } from "@/actions/auth";
import { redirect } from "next/navigation";
// Import the requested components
import { HeroHeader } from '@/components/NewNavbar';
import { Footer } from '@/components';

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
  // Add the layout structure with Navbar, Footer, and dark bg
  return (
    <div className="flex flex-col min-h-screen dark:bg-[#212227]">
      <HeroHeader/>
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}