'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getProductImagePlaceholder } from '@/utils/image-utils';
import RequestForm from './RequestForm';

interface ProductCardProps {
  productId: number;
  productName: string;
  brandName: string;
  brandId: number;
  productDescription?: string;
}

export default function ProductCard({
  productId,
  productName,
  brandName,
  brandId,
  productDescription = '',
}: ProductCardProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Clean brand name (remove www. if present)
  const cleanBrandName = brandName.replace(/^www\./i, '');
  
  // Generate a placeholder image
  const imageUrl = getProductImagePlaceholder(productName, 300, 200);
  
  // Truncate description to maintain consistent card height
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const truncatedDescription = truncateDescription(productDescription);
  
  return (
    <>
      <div className="h-full flex flex-col rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white dark:bg-gray-800">
        <Link href={`/brands/${brandId}-${encodeURIComponent(cleanBrandName)}/products/${productId}`} className="flex-grow flex flex-col">
          <div 
            className="h-48 w-full bg-cover bg-center flex-shrink-0"
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{productName}</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">{cleanBrandName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-3">{truncatedDescription}</p>
          </div>
        </Link>
        <div className="px-4 pb-4 mt-auto">
          <button
            onClick={() => setShowRequestForm(true)}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            Make Request
          </button>
        </div>
      </div>
      
      {showRequestForm && (
        <RequestForm
          productId={productId}
          productName={productName}
          brandName={cleanBrandName}
          onClose={() => setShowRequestForm(false)}
        />
      )}
    </>
  );
} 