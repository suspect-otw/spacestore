import { Navbar } from '@/components';
import { Footer } from '@/components';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children} 
      </main>
      <Footer />
    </div>
  );
}
