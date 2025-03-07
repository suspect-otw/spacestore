'use client';

import React from 'react';
import Link from 'next/link';
import { getBrandImagePlaceholder } from '@/utils/image-utils';

interface BrandCardProps {
  brandName: string;
  brandId: number;
  productCount?: number;
}

export default function BrandCard({ brandName, brandId, productCount = 0 }: BrandCardProps) {
  // Clean brand name (remove www. if present)
  const cleanBrandName = brandName.replace(/^www\./i, '');
  
  // Generate a placeholder image for the brand
  // Force regeneration of the image to ensure it's using the latest format
  const imageUrl = getBrandImagePlaceholder(cleanBrandName, 300, 200);
  
  return (
    <Link href={`/brands/${brandId}-${encodeURIComponent(cleanBrandName)}`} aria-label={`View ${cleanBrandName} brand details (ID: ${brandId})`}>
      <div className="group h-64 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div 
          className="h-48 w-full bg-cover bg-center flex-shrink-0 group-hover:opacity-90 transition-opacity duration-300"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="flex-grow flex flex-col justify-center items-center p-4 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {cleanBrandName}
          </h3>
          {productCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
} 