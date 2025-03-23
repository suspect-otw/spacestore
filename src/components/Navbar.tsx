'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Navbar = () => {
  const pathname = usePathname();
  const previousPath = usePrevious(pathname);
  const [isOpen, setIsOpen] = useState(false);

  const buttonNumbers = {'/': 1, '/brands': 2, '/about': 3, '/contact': 4};
  const prevNumber = previousPath ? buttonNumbers[previousPath as keyof typeof buttonNumbers] : 0;
  const currentNumber = buttonNumbers[pathname as keyof typeof buttonNumbers] || 0;
  const direction = currentNumber > prevNumber ? 'forward' : 'backward';

  // Utility function to determine animation properties
  const getAnimationProps = (buttonNumber: number) => {
    return {
      direction,
      isForward: currentNumber > prevNumber,
      buttonNumber,
    };
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    const isPrevious = previousPath === href;
    const buttonNumber = buttonNumbers[href as keyof typeof buttonNumbers];
    const { isForward } = getAnimationProps(buttonNumber);
    
    return (
      <Link href={href}>
        <motion.span
          className={`px-6 py-2 rounded-full text-[#212227] dark:text-white transition-all duration-400 inline-block relative overflow-hidden border border-transparent
            ${isActive ? 'text-white dark:text-[#212227]' : 'hover:border-[#8693AB] dark:hover:border-white/70'}`}
          initial={false}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-[#8693AB] dark:bg-[#8693AB]"
            initial={{
              width: isActive ? '0%' : isPrevious ? '100%' : '0%',
              left: (isForward && isActive) || (!isForward && isPrevious) ? 0 : 'auto',
              right: (!isForward && isActive) || (isForward && isPrevious) ? 0 : 'auto',
              opacity: isActive ? 0 : isPrevious ? 1 : 0,
            }}
            animate={{
              width: isActive ? '100%' : isPrevious ? '0%' : '0%',
              opacity: isActive ? 1 : isPrevious ? 0 : 0,
              left: (isForward && isActive) || (!isForward && isPrevious) ? 0 : 'auto',
              right: (!isForward && isActive) || (isForward && isPrevious) ? 0 : 'auto',
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
          <span className="relative z-10">{children}</span>
        </motion.span>
      </Link>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-[5.7px] border-b border-white/70 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#212227] dark:text-white">ProductReq</span>
              </Link>
            </div>

            {/* Center section - Navigation */}
            <div className="hidden md:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-center">
              <div className="flex space-x-1">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/brands">Brands</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>
            </div>

            {/* Right section - Auth buttons & Theme toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/signin"
                className="px-6 py-2 rounded-full text-[#212227] dark:text-white border border-[#212227]/20 dark:border-white/20 hover:bg-[#8693AB]/20 dark:hover:bg-white/20 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-[#8693AB] to-[#AAB9CF] hover:opacity-90 transition-all duration-200 shadow-md"
              >
                Sign Up
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#212227] dark:text-white hover:bg-white/10 dark:hover:bg-white/5 rounded-lg p-2 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden fixed inset-x-0 top-16 z-40"
          >
            <div className="bg-white/80 dark:bg-[#212227]/80 backdrop-blur-[5.7px] border-b border-white/70 dark:border-white/10 shadow-lg">
              <div className="space-y-1 px-4 py-6">
                <Link
                  href="/"
                  className="block py-3 text-center text-[#212227] dark:text-white hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/brands"
                  className="block py-3 text-center text-[#212227] dark:text-white hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Brands
                </Link>
                <Link
                  href="/about"
                  className="block py-3 text-center text-[#212227] dark:text-white hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block py-3 text-center text-[#212227] dark:text-white hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 space-y-4">
                  <Link
                    href="/login"
                    className="block w-full px-6 py-2 rounded-full text-[#212227] dark:text-white border border-[#212227]/20 dark:border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full px-6 py-2 rounded-full text-white bg-gradient-to-r from-[#8693AB] to-[#AAB9CF] hover:opacity-90 transition-all duration-200 shadow-md text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 