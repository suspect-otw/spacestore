"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { userAgent } from "next/server";

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
        revalidatePath("/" , "layout");
        return{status: "success", user: data.user}
    }
}

export async function signIn(formData: FormData) { 

    const supabase = await createClient();

    const credentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phoneNumber: formData.get("phoneNumber") as string,

    };  

    const { error , data} = await (await supabase).auth.signInWithPassword(credentials);

    if(error){
        return {
            status: error?.message,
            user: null,
        };
    } 
 //TODO: Create user instance in public.users_profiles table
    revalidatePath("/dashboard" , "layout");
    return {status: "success", user: data.user}
}

export async function signOut() {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();

    if(error){
        redirect("/error");
    }
    revalidatePath("/" , "layout");
    redirect("/login");
}

export async function getUser() {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.getSession();
    
    if(error){
        return {
            status: error?.message,
            user: null,
        };
    }
    
    if(!data.session){
        return {
            status: "No active session",
            user: null,
        };
    }
    
    return {
        status: "success",
        user: data.session.user,
    };
}

