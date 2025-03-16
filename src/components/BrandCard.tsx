'use client';

import React from 'react';
import Link from 'next/link';
import { getBrandImagePlaceholder, getRandomImageFromStorage } from '../utils/image-utils';

interface BrandCardProps {
  brandName: string;
  brandId: number;
  productCount?: number;
}

export default function BrandCard({ brandName, brandId, productCount = 0 }: BrandCardProps) {
  // Clean brand name (remove www. if present)
  const cleanBrandName = brandName.replace(/^www\./i, '');
  
  // Supabase'den rastgele görsel seçimi
  const imageUrl = getRandomImageFromStorage(brandId);
  
  return (
    <Link href={`/brands/${brandId}-${encodeURIComponent(cleanBrandName)}`} aria-label={`View ${cleanBrandName} brand details (ID: ${brandId})`}>
      <div className="group h-64 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="relative h-48 w-full flex-shrink-0 group-hover:opacity-90 transition-opacity duration-300">
          {/* Arka plan görseli */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Marka adı overlay */}
          <div className="absolute inset-x-0 top-0 flex justify-center items-start pt-3">
            <span 
              className="text-black font-bold px-2 max-w-[90%] text-center"
              style={{ 
                textShadow: '0px 0px 4px white, 0px 0px 4px white, 0px 0px 4px white',
                fontSize: cleanBrandName.length > 25 ? '1.25rem' : cleanBrandName.length > 15 ? '1.5rem' : '1.75rem',
                wordBreak: 'break-word',
                lineHeight: '1.2'
              }}
            >
              {cleanBrandName}
            </span>
          </div>
        </div>
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