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
      // In admin routes, get data from shared script tag
      if (isAdmin) {
        try {
          const scriptTag = document.getElementById('admin-user-data')
          if (scriptTag) {
            const data = JSON.parse(scriptTag.textContent || '{}')
            // Format data to match user object structure
            setUser({
              email: data.email,
              user_metadata: {
                full_name: data.name,
                avatar_url: data.avatar
              }
            })
          }
        } catch (error) {
          console.error('Error parsing admin user data:', error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      } else {
        // Outside admin, use normal fetch
        try {
          const response = await getUser();
          
          if (response.status === "success" && response.user) {
            setUser(response.user)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Error fetching user session:', error)
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
    <DropdownMenu>
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