'use client'
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link'
import { Menu, X, User as UserIcon, LogOut, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { UserNavAuth } from '@/components/user-nav-auth'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from '@/actions/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/brands' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
]

// Type for user data passed from layout
type UserData = {
    fullname: string;
    email: string;
    phoneNumber: string;
    role: string;
} | null;

export const HeroHeader = ({ 
    hasAuth = false, 
    userData = null 
}: { 
    hasAuth?: boolean, 
    userData?: UserData 
}) => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Function to get user initials from userData
    const getInitials = () => {
        if (!userData?.fullname) return 'U';
        
        const nameParts = userData.fullname.split(' ');
        if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
        
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    };

    // Handle logout
    const handleLogout = async () => {
        await signOut();
    };

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
                                {hasAuth && userData && (
                                    <div className="border-t pt-6 mt-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 rounded-full">
                                                            <AvatarFallback>{getInitials()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                                            <span className="truncate font-medium">{userData.fullname}</span>
                                                            <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
                                                        </div>
                                                    </div>
                                                    <MoreVertical className="size-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuLabel className="font-normal">
                                                    <div className="flex flex-col space-y-1">
                                                        <p className="text-sm font-medium leading-none">{userData.fullname}</p>
                                                        <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={isAdmin ? '/admin/profile' : '/dashboard/profile'}>
                                                        <UserIcon className="mr-2 h-4 w-4" />
                                                        <span>Profile</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={handleLogout}>
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    <span>Log out</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                            <div className="hidden lg:flex">
                                <ThemeToggle />
                            </div>                            
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {hasAuth ? (
                                    <div className="items-center hidden lg:flex">
                                        <UserNavAuth />
                                    </div>
                                ) : (
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}