'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface Brand {
  id: number;
  brand_name: string;
}

interface SimpleBrandSelectProps {
  defaultValue: string;
  name: string;
  onChange?: (value: string) => void;
  defaultLabel?: string;
}

export function SimpleBrandSelect({ defaultValue, name, onChange, defaultLabel }: SimpleBrandSelectProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(defaultValue);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBrandName, setCurrentBrandName] = useState(defaultLabel || '');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 50;
  
  // Initial load of brands
  useEffect(() => {
    const fetchInitialBrands = async () => {
      setIsLoading(true);
      try {
        await fetchBrands(1);
      } catch (error) {
        console.error("Error fetching initial brands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialBrands();
  }, []);
  
  // Set current brand name from defaultLabel
  useEffect(() => {
    if (defaultLabel) {
      setCurrentBrandName(defaultLabel);
    }
  }, [defaultLabel]);
  
  // Fetch brands with pagination and search
  const fetchBrands = async (pageNum: number, query: string = '') => {
    try {
      const response = await fetch(
        `/api/admin/brands/list?page=${pageNum}&limit=${limit}${query ? `&q=${encodeURIComponent(query)}` : ''}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if data.brands exists, if not, use data.data if available
      const brandsList = data.brands || data.data || [];
      
      if (pageNum === 1) {
        setBrands(brandsList);
        setFilteredBrands(brandsList);
      } else {
        setBrands(prev => [...prev, ...brandsList]);
        setFilteredBrands(prev => [...prev, ...brandsList]);
      }
      
      setHasMore(brandsList.length === limit);
      
      // Find the current brand name if defaultValue is a brand ID and defaultLabel is not provided
      if (defaultValue && defaultValue !== 'none' && pageNum === 1 && !defaultLabel) {
        const currentBrand = brandsList.find((brand: Brand) => brand.id.toString() === defaultValue);
        if (currentBrand) {
          setCurrentBrandName(currentBrand.brand_name);
        }
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching brands:", error);
      return { brands: [] };
    }
  };
  
  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    
    if (query.trim() === '') {
      // If search is cleared, reset to initial brands
      setIsLoading(true);
      try {
        await fetchBrands(1);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Search with the query
      setIsLoading(true);
      try {
        await fetchBrands(1, query);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Load more brands
  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      await fetchBrands(nextPage, searchQuery);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    
    // Update current brand name
    if (newValue === 'none') {
      setCurrentBrandName('None');
    } else {
      const selectedBrand = brands.find(brand => brand.id.toString() === newValue);
      if (selectedBrand) {
        setCurrentBrandName(selectedBrand.brand_name);
      }
    }
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };
  
  return (
    <div className="w-full">
      <input type="hidden" name={name} value={value} />
      <Select 
        defaultValue={value} 
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a brand">
            {currentBrandName || (value === 'none' ? 'None' : 'Select a brand')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="flex items-center px-3 pb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search brands..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-8"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ScrollArea className="max-h-[300px]">
            <SelectItem value="none">None</SelectItem>
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading brands...</span>
              </div>
            ) : (
              <>
                {filteredBrands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.brand_name}
                  </SelectItem>
                ))}
                {filteredBrands.length === 0 && (
                  <div className="py-2 px-3 text-sm text-muted-foreground">
                    No brands found
                  </div>
                )}
                {hasMore && (
                  <div className="flex justify-center py-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        loadMore();
                      }}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load more"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
