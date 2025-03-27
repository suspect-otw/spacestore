"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full"
      >
        <MoonIcon className="h-10 w-10 text-blue-300" strokeWidth={2} />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full bg-background transition-colors duration-300"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative flex items-center justify-center h-full w-full">
        <SunIcon 
          className={`absolute h-5 w-5 transform transition-all duration-500 ease-in-out ${
            isDark 
              ? 'rotate-[-180deg] scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100 text-yellow-500'
          }`}
          strokeWidth={2}
        />
        <MoonIcon 
          className={`absolute h-5 w-5 transform transition-all duration-500 ease-in-out ${
            isDark 
              ? 'rotate-0 scale-100 opacity-100 text-blue-300' 
              : 'rotate-[180deg] scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
      </div>
    </Button>
  )
}