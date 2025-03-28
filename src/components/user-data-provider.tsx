"use client"

import { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

type UserProfile = {
  name: string
  email: string
  avatar: string
}

type UserDataContextType = {
  user: UserProfile
  loading: boolean
}

const defaultUser: UserProfile = {
  name: "Guest User",
  email: "guest@example.com",
  avatar: "/placeholder.svg",
}

const UserDataContext = createContext<UserDataContextType>({
  user: defaultUser,
  loading: true,
})

export function UserDataProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserProfile>(defaultUser)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log("No authenticated user")
          setLoading(false)
          return
        }

        // Get user details from session
        const { user: authUser } = session
        
        // Create a user profile from the auth user
        const userProfile: UserProfile = {
          name: authUser.user_metadata?.fullname || "User",
          email: authUser.email || "",
          avatar: authUser.user_metadata?.avatar_url || "/placeholder.svg",
        }
        
        setUser(userProfile)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          if (session?.user) {
            const authUser = session.user
            setUser({
              name: authUser.user_metadata?.fullname || "User",
              email: authUser.email || "",
              avatar: authUser.user_metadata?.avatar_url || "/placeholder.svg",
            })
          }
        } else if (event === "SIGNED_OUT") {
          setUser(defaultUser)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <UserDataContext.Provider value={{ user, loading }}>
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider")
  }
  return context
} 