"use client";
import React, { useState } from "react";
import { signIn } from "@/actions/auth";
import { getRole } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginGoogle from "./LoginGoogle";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);
    if (result.status === "success") {
      const role = await getRole();
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "staff") {
        router.push("/staff"); // Assuming you have a /staff route
      } else if (role === "user") {
        router.push("/dashboard"); // Assuming you have a /dashboard route
      } else {
        // Handle unexpected role or error, maybe redirect to a default page or show an error
        // Although getRole should redirect to /login on error/invalid role
        console.error("Unexpected user role:", role);
        setError("Login successful, but could not determine user role for redirection.");
        // Optional: redirect to a generic logged-in page if needed
        // router.push("/"); 
      }
    } else {
      setError(result.status);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        
        <LoginGoogle />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account? {"  "}
        <Link href="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
