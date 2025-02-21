'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockBrands, mockProducts, getBrandById } from '@/lib/mock-data';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';

interface SearchBarProps {
  initialQuery?: string;
}

interface SearchResult {
  type: 'brand' | 'product';
  name: string;
  url: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setSearchResults([]);
      if (window.location.pathname === '/brands' && window.location.search !== '') {
        router.push('/brands');
      }
      return;
    }

    const searchTerm = debouncedQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search brands
    mockBrands.forEach(brand => {
      if (brand.brandName.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'brand',
          name: brand.brandName,
          url: `/brands/${brand.brandName}`
        });
      }
    });

    // Search products
    mockProducts.forEach(product => {
      if (
        product.productName.toLowerCase().includes(searchTerm) ||
        product.productDescription.toLowerCase().includes(searchTerm)
      ) {
        const brand = getBrandById(product.brandId);
        if (brand) {
          results.push({
            type: 'product',
            name: product.productName,
            url: `/brands/${brand.brandName}/products/${product.productId}`
          });
        }
      }
    });

    setSearchResults(results.slice(0, 5)); // Limit to 5 results
  }, [debouncedQuery, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/brands?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/brands');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setShowDropdown(true);
    
    if (newValue.trim() === '' && window.location.pathname === '/brands') {
      router.push('/brands');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowDropdown(false);
      if (query.trim() === '') {
        router.push('/brands');
      }
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 bg-white dark:bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-dark dark:text-dark"
          placeholder="Search brands and products..."
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-colors duration-200"
        >
          Search
        </button>
      </form>

      {showDropdown && searchResults.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white dark:bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
          onMouseLeave={() => setShowDropdown(false)}
        >
          {searchResults.map((result, index) => (
            <Link
              key={`${result.type}-${index}`}
              href={result.url}
              className="block px-4 py-3 hover:bg-gray-100 transition-colors duration-200 text-dark"
              onClick={() => setShowDropdown(false)}
            >
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full mr-2">
                  {result.type === 'brand' ? 'Brand' : 'Product'}
                </span>
                <span>{result.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 