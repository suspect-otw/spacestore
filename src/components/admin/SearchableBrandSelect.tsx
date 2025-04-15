'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Brand {
  id: number;
  brand_name: string;
}

interface SearchableBrandSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyValue?: string;
  emptyLabel?: string;
  className?: string;
}

export function SearchableBrandSelect({
  value,
  onValueChange,
  placeholder = "Select a brand",
  emptyValue = "all",
  emptyLabel = "All brands",
  className,
}: SearchableBrandSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Debounce search query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to page 1 when search query changes
    }, 300); // 300ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch brands when search query or page changes
  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '50',
        });
        
        if (debouncedSearchQuery) {
          queryParams.set('q', debouncedSearchQuery);
        }
        
        const url = `/api/admin/brands/list?${queryParams.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        
        const data = await response.json();
        
        // On first page, replace brands; otherwise append
        if (page === 1) {
          setBrands(data.data || []);
        } else {
          setBrands(prev => [...prev, ...(data.data || [])]);
        }
        
        setTotalPages(data.totalPages || 1);
        setHasMore(page < (data.totalPages || 1));
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [debouncedSearchQuery, page]);

  // Load more brands when scrolling to bottom
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Get the selected brand name for display
  const selectedBrandName = React.useMemo(() => {
    if (value === emptyValue) return emptyLabel;
    const selectedBrand = brands.find(brand => brand.id.toString() === value);
    return selectedBrand ? selectedBrand.brand_name : placeholder;
  }, [value, brands, emptyValue, emptyLabel, placeholder]);

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle click outside to close popover but not dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        // Don't close if clicking on the trigger
        !event.composedPath().some(el => 
          el instanceof HTMLElement && 
          (el === triggerRef.current || el.getAttribute('role') === 'combobox')
        )
      ) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Handle selection from dropdown
  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue);
    setOpen(false);
  };

  return (
    <Popover 
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          onClick={(e) => {
            // Prevent event propagation to avoid closing parent dialogs
            e.stopPropagation();
            e.preventDefault();
            setOpen(!open);
          }}
          onMouseDown={(e) => {
            // Prevent default to avoid losing focus
            e.preventDefault();
          }}
        >
          <span className="truncate">{selectedBrandName}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        ref={popoverRef}
        className="w-[300px] p-0" 
        align="start"
        sideOffset={4}
        onEscapeKeyDown={(e) => {
          // Prevent escape from closing parent dialogs
          e.stopPropagation();
          setOpen(false);
        }}
        onPointerDownOutside={(e) => {
          // Prevent clicks from closing parent dialogs
          e.stopPropagation();
        }}
        onInteractOutside={(e) => {
          // Prevent interactions from closing parent dialogs
          e.stopPropagation();
        }}
        onOpenAutoFocus={(e) => {
          // Prevent auto focus to allow our custom focus
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          // Prevent focus returning to trigger on close
          e.preventDefault();
        }}
        style={{ 
          zIndex: 9999,
          position: 'relative'
        }}
      >
        <Command shouldFilter={false}>
          {/* Custom search input wrapper to avoid double search icons */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              className="flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onKeyDown={(e) => {
                // Prevent Enter key from submitting the form
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
                // Close on Escape
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                }
              }}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSearchQuery('');
                }}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            {isLoading && page === 1 ? (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Loading brands...</p>
              </div>
            ) : (
              <>
                <CommandEmpty>No brands found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key={emptyValue}
                    value={emptyValue}
                    onSelect={() => handleSelect(emptyValue)}
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      // Prevent default to avoid losing focus
                      e.preventDefault();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === emptyValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {emptyLabel}
                  </CommandItem>
                  {brands.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.id.toString()}
                      onSelect={() => handleSelect(brand.id.toString())}
                      className="cursor-pointer"
                      onMouseDown={(e) => {
                        // Prevent default to avoid losing focus
                        e.preventDefault();
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === brand.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {brand.brand_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {hasMore && (
                  <div className="flex justify-center p-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        loadMore();
                      }}
                      onMouseDown={(e) => {
                        // Prevent default to avoid losing focus
                        e.preventDefault();
                      }}
                      disabled={isLoading}
                      className="cursor-pointer"
                    >
                      {isLoading ? (
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
