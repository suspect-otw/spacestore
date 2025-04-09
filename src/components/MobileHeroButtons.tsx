"use client";

import Link from "next/link";

export default function MobileHeroButtons() {
  return (
    <div className="flex flex-row items-stretch justify-center gap-x-2 sm:gap-x-4">
      <Link 
        href="/brands" 
        className="flex-1 inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3 text-sm md:text-base rounded-full bg-white/80 text-[#212227] hover:bg-white dark:bg-[#8693AB] dark:text-white dark:hover:bg-[#AAB9CF] transition-all duration-200 backdrop-blur-sm text-center"
      >
        Browse Brands
        <svg
          className="ml-2 w-4 h-4 md:w-5 md:h-5 hidden sm:inline-block"
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
      <Link 
        href="/register" 
        className="flex-1 inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3 text-sm md:text-base rounded-full text-[#212227] dark:text-white border border-[#212227]/20 dark:border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 text-center"
      >
        Get Started
        <svg
          className="ml-2 w-4 h-4 md:w-5 md:h-5 hidden sm:inline-block"
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
    </div>
  );
} 