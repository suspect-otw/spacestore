'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

  useEffect(() => {
    async function fetchUserData() {
        try {
            const response = await getUser();
            
            if (response.status === "success" && response.user) {
                setUser(response.user); // Set user if fetch is successful and user exists
            } else {
                setUser(null); // Explicitly set user to null if not logged in or error
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
            setUser(null); // Set user to null on error
        } finally {
            setLoading(false);
        }
    }

    fetchUserData();
}, []);

  async function handleSignOut() {
    try {
      await signOut()
      setUser(null); // Update state after sign out
      // Note: No need for router.push as signOut likely handles redirect
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Extract user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata?.fullname) return 'U'
    
    const nameParts = user.user_metadata.fullname.split(' ')
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
            <p className="text-sm font-medium leading-none">{user?.user_metadata?.fullname || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 