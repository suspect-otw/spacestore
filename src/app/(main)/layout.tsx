import { HeroHeader } from '@/components/NewNavbar';
import { Footer } from '@/components';
import { getUserProfile } from '@/actions/auth';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const response = await getUserProfile();
  const userData = response?.data;
  const hasAuth = !!userData;
  console.log(userData)
  return (
    <div className="flex flex-col min-h-screen dark:bg-[#212227]">
      <HeroHeader hasAuth={hasAuth} userData={userData} />
      <main className="flex-grow pt-20">
        {children} 
      </main>
      <Footer />
    </div>
  );
}
