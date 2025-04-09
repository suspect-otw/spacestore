import { HeroHeader } from '@/components/NewNavbar';
import { Footer } from '@/components';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen dark:bg-[#212227]">
      <HeroHeader/>
      <main className="flex-grow pt-20">
        {children} 
      </main>
      <Footer />
    </div>
  );
}
