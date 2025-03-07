'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  id: number;
  type: 'brand' | 'product';
  name: string;
  brandName?: string;
  description?: string;
}

// API response types
interface BrandData {
  brandId: number;
  brandName: string;
}

interface BrandWithProduct {
  brand: {
    brandId: number;
    brandName: string;
  };
  product: {
    productId: number;
    productName: string;
    productDescription: string;
  };
}

interface ApiResponse {
  brands: BrandData[];
  products: BrandWithProduct[];
}

export default function SearchBar({
  initialQuery = '',
  placeholder = 'Search brands and products...',
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch real data from API
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query.trim())}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        
        const data: ApiResponse = await response.json();
        
        // Format brands as suggestions
        const brandSuggestions: Suggestion[] = (data.brands || []).map((brand: BrandData) => ({
          id: brand.brandId,
          type: 'brand',
          name: brand.brandName
        }));
        
        // Format products as suggestions
        const productSuggestions: Suggestion[] = (data.products || []).map((item: BrandWithProduct) => ({
          id: item.product.productId,
          type: 'product',
          name: item.product.productName,
          brandName: item.brand.brandName,
          description: item.product.productDescription
        }));
        
        // Combine and sort suggestions
        const allSuggestions = [...brandSuggestions, ...productSuggestions];
        
        setSuggestions(allSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // If API fails, show empty results
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the search to avoid too many requests
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [query]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/brands?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'brand') {
      router.push(`/brands/${suggestion.id}-${encodeURIComponent(suggestion.name)}`);
    } else if (suggestion.type === 'product' && suggestion.brandName) {
      // We need to get the brand ID for the product, but we don't have it in the suggestion
      // For now, we'll navigate to the search results page with the product name as the query
      router.push(`/brands?q=${encodeURIComponent(suggestion.name)}`);
    }
    setShowSuggestions(false);
  };
  
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            aria-label="Search"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400 dark:text-gray-300" />
          </div>
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label="Clear search"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
            </button>
          )}
        </div>
        <button type="submit" className="hidden">Search</button>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestions && query.trim().length >= 2 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border dark:border-gray-700"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Loader2 size={20} className="animate-spin mx-auto mb-2" />
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion) => (
                <li 
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                >
                  {suggestion.type === 'brand' ? (
                    <div className="flex items-center">
                      <div className="w-auto h-6 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full mr-2 text-xs font-medium px-2 dark:bg-indigo-900 dark:text-indigo-200">
                        Brand
                      </div>
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">
                          {suggestion.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="w-auto h-6 flex items-center justify-center bg-green-100 text-green-800 rounded-full mr-2 text-xs font-medium px-2 dark:bg-green-900 dark:text-green-200 shrink-0">
                        Product
                      </div>
                      <div className="flex-1 mx-2">
                        <div className="font-medium dark:text-white">
                          {suggestion.name}
                        </div>
                      </div>
                      {suggestion.brandName && (
                        <div className="text-right shrink-0">
                          <span className="font-normal text-xs text-gray-500 dark:text-gray-400">
                            from {suggestion.brandName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
} 