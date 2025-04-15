'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import { getUser, signOut } from '@/actions/auth'
import { Skeleton } from "@/components/ui/skeleton"

export function UserNavAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  useEffect(() => {
    async function fetchUserData() {
      console.log(`[UserNavAuth] Running in ${isAdmin ? 'ADMIN' : 'REGULAR'} mode`);
      
      // In admin routes, get data from shared script tag
      if (isAdmin) {
        try {
          console.log('[UserNavAuth] Attempting to get data from admin-user-data script tag');
          const scriptTag = document.getElementById('admin-user-data')
          if (scriptTag) {
            const data = JSON.parse(scriptTag.textContent || '{}')
            console.log('[UserNavAuth] Found admin data from script tag:', data);
            // Format data to match user object structure
            setUser({
              email: data.email,
              user_metadata: {
                full_name: data.name,
                avatar_url: data.avatar
              }
            })
          } else {
            console.warn('[UserNavAuth] admin-user-data script tag not found!');
          }
        } catch (error) {
          console.error('[UserNavAuth] Error parsing admin user data:', error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      } else {
        // Outside admin, use normal fetch
        console.log('[UserNavAuth] Using standard fetch for user data');
        try {
          const response = await getUser();
          console.log('[UserNavAuth] Auth response:', response);
          
          if (response.status === "success" && response.user) {
            console.log('[UserNavAuth] User authenticated successfully:', {
              email: response.user.email,
              role: response.user.role,
              metadata: response.user.user_metadata
            });
            setUser(response.user)
          } else {
            console.log('[UserNavAuth] No user found or auth failed');
            setUser(null)
          }
        } catch (error) {
          console.error('[UserNavAuth] Error fetching user session:', error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData();
  }, [isAdmin]);

  async function handleSignOut() {
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Extract user initials for avatar fallback
  const getUserInitials = () => {
    // Check for full_name (Google) first, then fullname (Email/Pass)
    const name = user?.user_metadata?.full_name || user?.user_metadata?.fullname;
    if (!name) return 'U'
    
    const nameParts = name.split(' ')
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  if (loading) {
    return (
      <Skeleton className="h-10 w-10 rounded-full" />
    )
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={user?.user_metadata?.fullname || 'User'} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {/* Check for full_name (Google) first, then fullname (Email/Pass) */}
            <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || user?.user_metadata?.fullname || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(isAdmin ? '/admin/profile' : '/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {!isAdmin && (
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 