"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MobileHeroButtons() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Initial check
      setIsMobile(window.innerWidth < 640);

      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
      };

      window.addEventListener("resize", handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div className="flex flex-row space-x-4">
      <Link 
        href={isMobile ? "/register" : "/brands"} 
        className="inline-flex items-center px-8 py-3 rounded-full bg-white/80 text-[#212227] hover:bg-white dark:bg-[#8693AB] dark:text-white dark:hover:bg-[#AAB9CF] transition-all duration-200 backdrop-blur-sm"
      >
        {isMobile ? "Get Started" : "Browse Brands"}
        <svg
          className="ml-2 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
      {!isMobile && (
        <Link 
          href="/register" 
          className="inline-flex items-center px-8 py-3 rounded-full text-[#212227] dark:text-white border border-[#212227]/20 dark:border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200"
        >
          Get Started
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      )}
    </div>
  );
} 