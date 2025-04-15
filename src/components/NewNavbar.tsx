'use client'
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { UserNavAuth } from '@/components/user-nav-auth';
import { getUser } from '@/actions/auth';
import { Skeleton } from '@/components/ui/skeleton';

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/brands' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
]

// Create client component to handle auth state
const AuthButtons = ({ isScrolled }: { isScrolled: boolean }) => {
    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const pathname = usePathname();
    
    // Check if we're in admin section to avoid duplicate fetches
    const isAdmin = pathname?.startsWith('/admin');

    React.useEffect(() => {
        // Skip fetch if we're in admin section (already handled there)
        if (isAdmin) {
            setLoading(false);
            return;
        }

        // Use sessionStorage to cache auth state during navigation
        const checkAuth = async () => {
            try {
                // Try to get from session storage first
                const cachedUser = sessionStorage.getItem('spacestore_user');
                if (cachedUser) {
                    setUser(JSON.parse(cachedUser));
                    setLoading(false);
                    return;
                }
                
                // If no cached data, fetch from server
                const response = await getUser();
                
                if (response.status === "success" && response.user) {
                    // Store in session storage
                    sessionStorage.setItem('spacestore_user', JSON.stringify(response.user));
                    setUser(response.user);
                } else {
                    setUser(null);
                    // Clear session storage if not authenticated
                    sessionStorage.removeItem('spacestore_user');
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
        
        // Listen for auth state changes from other components
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'spacestore_user') {
                if (e.newValue) {
                    setUser(JSON.parse(e.newValue));
                } else {
                    setUser(null);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [isAdmin]);

    if (loading) {
        return <Skeleton className="h-9 w-20" />;
    }

    if (user) {
        return <UserNavAuth />;
    }

    return (
        <>
            <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(isScrolled && 'hidden')}>
                <Link href="/login">
                    <span>Login</span>
                </Link>
            </Button>
            <Button
                asChild
                size="sm"
                className={cn(isScrolled && 'hidden')}>
                <Link href="/register">
                    <span>Sign Up</span>
                </Link>
            </Button>
            <Button
                asChild
                size="sm"
                className={cn(isScrolled ? 'inline-flex' : 'hidden')}>
                <Link href="/register">
                    <span>Sign Up</span>
                </Link>
            </Button>
        </>
    );
};

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Image
                                src="https://www.spacestoreone.com/wp-content/uploads/2023/08/cropped-cropped-onlinelogomaker-080923-2325-3883-500photoAid-removed-background.png"
                                width={90}
                                height={90}
                                alt="Space Store One Logo"
                                />
                            </Link>

                            <div className="flex items-center gap-4 ">
                                <div className="block lg:hidden">
                                    <ThemeToggle />
                                </div>
                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="hidden lg:block">
                                <ThemeToggle />
                            </div>                            
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <AuthButtons isScrolled={isScrolled} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}