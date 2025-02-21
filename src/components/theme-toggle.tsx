"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-md border border-input bg-background"
      >
        <span className="h-5 w-5" />
      </Button>
    )
  }

  const raysVariants = {
    hidden: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const rayVariant = {
    hidden: {
      opacity: 0,
      scale: 0.5
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-md border bg-background hover:bg-yellow-400 border-yellow-200 dark:border-slate dark:hover:bg-white dark:bg-[#8693AB] group transition-colors duration-200"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-yellow-600 group-hover:text-white dark:text-white dark:group-hover:text-[#212227] transition-colors duration-200"
      >
        {theme === "dark" ? (
          // Moon icon with hover effects
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            className="transition-colors duration-200"
          />
        ) : (
          // Sun icon with rays
          <motion.g variants={raysVariants} initial="hidden" animate="visible" className="stroke-yellow-600 group-hover:stroke-white">
            <motion.circle cx="12" cy="12" r="5" variants={rayVariant} />
            <motion.line x1="12" y1="1" x2="12" y2="3" variants={rayVariant} />
            <motion.line x1="12" y1="21" x2="12" y2="23" variants={rayVariant} />
            <motion.line x1="4.22" y1="4.22" x2="5.64" y2="5.64" variants={rayVariant} />
            <motion.line x1="18.36" y1="18.36" x2="19.78" y2="19.78" variants={rayVariant} />
            <motion.line x1="1" y1="12" x2="3" y2="12" variants={rayVariant} />
            <motion.line x1="21" y1="12" x2="23" y2="12" variants={rayVariant} />
            <motion.line x1="4.22" y1="19.78" x2="5.64" y2="18.36" variants={rayVariant} />
            <motion.line x1="18.36" y1="5.64" x2="19.78" y2="4.22" variants={rayVariant} />
          </motion.g>
        )}
      </motion.svg>
    </Button>
  )
}