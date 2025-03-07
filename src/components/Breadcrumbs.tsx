'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  homeLabel?: string;
  brandName?: string;
  brandId?: number;
  productName?: string;
  productId?: string;
}

export default function Breadcrumbs({
  homeLabel = 'Home',
  brandName,
  brandId,
  productName,
  productId
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on the current path
  const getBreadcrumbs = () => {
    const items = [
      { label: homeLabel, href: '/' },
    ];
    
    // Add Brands link if we're in the brands section or if explicitly provided
    if (pathname?.includes('/brands') || brandName) {
      items.push({ label: 'Brands', href: '/brands' });
    }
    
    if (brandName) {
      // Use the new URL format if brandId is provided
      const brandUrl = brandId 
        ? `/brands/${brandId}-${encodeURIComponent(brandName)}`
        : `/brands/${encodeURIComponent(brandName)}`;
      items.push({ label: brandName, href: brandUrl });
    }
    
    if (productName && productId) {
      // Use the new URL format if brandId is provided
      const brandUrl = brandId 
        ? `/brands/${brandId}-${encodeURIComponent(brandName || '')}`
        : `/brands/${encodeURIComponent(brandName || '')}`;
      items.push({ 
        label: productName, 
        href: `${brandUrl}/products/${productId}` 
      });
    }
    
    return items;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  return (
    <nav className="flex items-center text-sm mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isActive = pathname === item.href;
          
          return (
            <React.Fragment key={item.href}>
              <li className="flex items-center">
                {isLast || isActive ? (
                  <span className="text-gray-500 font-medium">{item.label}</span>
                ) : (
                  <Link 
                    href={item.href}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              
              {!isLast && (
                <li className="mx-2 text-gray-400">
                  <ChevronRight size={16} />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
} 