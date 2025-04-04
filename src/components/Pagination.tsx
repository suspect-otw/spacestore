'use client';

import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  basePath,
  queryParams = {}
}: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Create query string from params
  const createQueryString = (page: number) => {
    const params = new URLSearchParams();
    
    // Add existing query params
    Object.entries(queryParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    
    // Add page param
    params.set('page', page.toString());
    
    return params.toString();
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?${createQueryString(currentPage - 1)}`}
          className="px-4 py-2 border rounded text-primary border-primary hover:bg-primary/10"
        >
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 border rounded text-gray-400 border-gray-300 cursor-not-allowed"
        >
          Previous
        </button>
      )}
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        if (page < 0) {
          // Render ellipsis
          return (
            <span key={`ellipsis-${index}`} className="px-4 py-2">
              ...
            </span>
          );
        }
        
        return (
          <Link
            key={page}
            href={`${basePath}?${createQueryString(page)}`}
            className={`px-4 py-2 border rounded ${
              currentPage === page
                ? 'bg-primary text-white dark:text-black border-primary'
                : 'text-primary border-primary hover:bg-primary/10'
            }`}
          >
            {page}
          </Link>
        );
      })}
      
      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?${createQueryString(currentPage + 1)}`}
          className="px-4 py-2 border rounded text-primary border-primary hover:bg-primary/10"
        >
          Next
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 border rounded text-gray-400 border-gray-300 cursor-not-allowed"
        >
          Next
        </button>
      )}
    </div>
  );
} 