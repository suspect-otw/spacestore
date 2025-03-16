'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getProductImagePlaceholder, getRandomImageFromStorage } from '../utils/image-utils';
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
  
  // Supabase'den rastgele görsel seçimi
  const imageUrl = getRandomImageFromStorage(productId);
  
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
          <div className="relative h-48 w-full flex-shrink-0">
            {/* Arka plan görseli */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Ürün adı overlay */}
            <div className="absolute inset-x-0 top-0 flex justify-center items-start pt-3">
              <span 
                className="text-black font-bold px-2 max-w-[90%] text-center"
                style={{ 
                  textShadow: '0px 0px 4px white, 0px 0px 4px white, 0px 0px 4px white',
                  fontSize: productName.length > 25 ? '1rem' : productName.length > 15 ? '1.25rem' : '1.5rem',
                  wordBreak: 'break-word',
                  lineHeight: '1.2'
                }}
              >
                {productName}
              </span>
            </div>
          </div>
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