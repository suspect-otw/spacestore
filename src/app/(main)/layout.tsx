import { HeroHeader } from '@/components/NewNavbar';
import { Footer } from '@/components';
import { getUserSession } from '@/actions/auth';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const response = await getUserSession();
  const hasAuth = !!response?.user;

  return (
    <div className="flex flex-col min-h-screen dark:bg-[#212227]">
      <HeroHeader hasAuth={hasAuth} />
      <main className="flex-grow pt-20">
        {children} 
      </main>
      <Footer />
    </div>
  );
}
