'use client';

import { useRouter } from 'next/navigation';
import { ProductsTable } from './ProductsTable';

interface Product {
  id: number;
  product_name: string;
  product_description: string | null;
  brand_id: number | null;
  created_at: string;
  updated_at: string;
  brand?: {
    id: number;
    brand_name: string;
  };
}

interface ProductsTableWrapperProps {
  products: Product[];
}

export function ProductsTableWrapper({ products }: ProductsTableWrapperProps) {
  const router = useRouter();
  
  const handleRefresh = () => {
    // Use router.refresh() to refresh the current page data
    router.refresh();
  };
  
  return (
    <ProductsTable 
      products={products} 
      onRefresh={handleRefresh} 
    />
  );
}
