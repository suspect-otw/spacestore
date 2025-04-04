"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { userAgent } from "next/server";


export async function signInWithGoogle() {

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const auth_callback_url = `${origin}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: auth_callback_url,
    },
  });
  if(error){
    redirect("/error")
  } else if(data.url){
    return redirect(data.url)
  }
}

export async function getUserSession() {
    const supabase = await createClient();
    const { data , error } = await supabase.auth.getUser();
    if(error){
        return {
            status: error?.message,
            user: null,
        };
    }
    return {status: "success", user: data.user};
}

export async function signUp(formData: FormData) {
    const supabase = await createClient();

    const credentials = {
        fullname: formData.get("fullname") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phoneNumber: formData.get("phoneNumber") as string,

    };    

    const { error , data } =  await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                fullname: credentials.fullname,
                phoneNumber: credentials.phoneNumber,
                role: "user",
            },
        },
    });
    if(error) {
        return {
            status: error?.message,
            user: null,
        };
    }else if(data?.user?.identities?.length === 0){
       return { 
        status: "User with this email already exists, please login!",
        user: null,
       }
    }
    else{
        revalidatePath("/confirm-email" , "layout");
        return{status: "success", user: data.user}
    }
}

export async function signIn(formData: FormData) { 

    const supabase = await createClient();

    const credentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };  

    const { error , data} = await supabase.auth.signInWithPassword(credentials);

    if(error){
        return {
            status: error?.message,
            user: null,
        };
    } 

    revalidatePath("/dashboard" , "layout");
    return {status: "success", user: data.user}
}

export async function signOut() {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();

    if(error){
        redirect("/error");
    }
    revalidatePath("/login" , "layout");
    redirect("/login");
}

export async function getUser() {
    const supabase = await createClient();
    
    // Use getUser() instead of getSession()
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
        return {
            status: error.message,
            user: null,
        };
    }
    
    if (!user) {
        return {
            status: "No authenticated user",
            user: null,
        };
    }
    
    return {
        status: "success",
        user: user, // This user is authenticated via the server
    };
}

export async function getRole(): Promise<"user" | "admin" | "staff" | null> {
  const supabase = await createClient();
  
  try {
    // Get authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // If no user or auth error, redirect to login
    if (error || !user) {
      await supabase.auth.signOut();
      redirect("/login");
    }

    // Fetch role from user_profiles
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // If profile error, invalidate session
    if (profileError || !profile) {
      await supabase.auth.signOut();
      redirect("/login");
    }

    // Validate role type
    const validRoles = ["user", "admin", "staff"];
    if (!validRoles.includes(profile.role)) {
      await supabase.auth.signOut();
      redirect("/login");
    }

    return profile.role as "user" | "admin" | "staff";
    
  } catch (error) {
    console.error("Role check error:", error);
    await supabase.auth.signOut();
    redirect("/login");
  }
}

export async function getUserProfile(): Promise<{
    status: string;
    data: {
      fullname: string;
      email: string;
      phoneNumber: string;
      role: string;
    } | null;
}>
{
    const supabase = await createClient();
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { 
          status: error?.message || "No authenticated user", 
          data: null 
        };
      }
  
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("fullname, email, phoneNumber, role")
        .eq("id", user.id)
        .single();
  
      if (profileError || !profile) {
        return {
          status: profileError?.message || "Profile not found",
          data: null
        };
      }
  
      return {
        status: "success",
        data: {
          fullname: profile.fullname,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          role: profile.role
        }
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {
        status: "Internal server error",
        data: null
      };
    }
}
