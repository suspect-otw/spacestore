'use client';

import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import RequestForm from './RequestForm';
import { Brand, Product } from '../types';
import { getProductImagePlaceholder, getRandomImageFromStorage } from '../utils/image-utils';
import { useState } from 'react';

interface ProductDetailClientProps {
  product: Product;
  brand: Brand;
  cleanBrandName: string;
}

export default function ProductDetailClient({ 
  product, 
  brand, 
  cleanBrandName 
}: ProductDetailClientProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Supabase'den rastgele görsel seçimi
  const productImageUrl = getRandomImageFromStorage(product.productId);
  
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs 
            brandName={cleanBrandName} 
            brandId={brand.brandId}
            productName={product.productName} 
            productId={product.productId.toString()} 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
          <div className="md:grid md:grid-cols-2 lg:grid-cols-5">
            {/* Product Image - Takes up 2/5 on large screens */}
            <div className="lg:col-span-2 relative">
              <div 
                className="h-64 md:h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${productImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '400px'
                }}
              />
              
              {/* Ürün adı overlay */}
              <div className="absolute inset-x-0 top-0 flex justify-center items-start pt-4">
                <span 
                  className="text-black font-bold px-2 max-w-[90%] text-center"
                  style={{ 
                    textShadow: '0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white',
                    fontSize: product.productName.length > 30 ? '1.5rem' : product.productName.length > 20 ? '2rem' : '2.5rem',
                    wordBreak: 'break-word',
                    lineHeight: '1.2'
                  }}
                >
                  {product.productName}
                </span>
              </div>
            </div>
            
            {/* Product Details - Takes up 3/5 on large screens */}
            <div className="p-6 md:p-8 lg:col-span-3">
              <div className="flex flex-col h-full">
                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                      {cleanBrandName}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      Brand ID: {brand.brandId}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {product.productName}
                  </h1>
                  
                  <div className="prose prose-indigo max-w-none mb-8 dark:prose-invert">
                    <p className="text-gray-700 dark:text-gray-300">{product.productDescription}</p>
                  </div>
                  
                  {brand.brandDescription && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">About {cleanBrandName}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{brand.brandDescription}</p>
                    </div>
                  )}
                </div>
                
                {/* Action button at the bottom */}
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    Make Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showRequestForm && (
        <RequestForm
          productId={product.productId}
          productName={product.productName}
          brandName={cleanBrandName}
          onClose={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
} 