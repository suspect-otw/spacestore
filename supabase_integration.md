# Supabase to Next.js Integration Guide

This guide explains how to integrate your Supabase database containing brands and products data with your Next.js frontend application using Prisma ORM.

## Overview

Your database contains two main tables:
1. `brands` - Contains information about brands (id, brand_url, is_scraped, scrape_notes, etc.)
2. `products` - Contains product information (id, brand_id, product_name, product_description, etc.)

The relationship between these tables is:
- One brand can have many products (one-to-many relationship)
- Each product belongs to exactly one brand

## Step 1: Set Up Prisma in Your Next.js Project

First, install Prisma and initialize it in your project:

```bash
# Install Prisma CLI and client
npm install prisma @prisma/client

# Initialize Prisma in your project
npx prisma init
```

## Step 2: Configure Prisma for Supabase PostgreSQL

Update your `.env` file with your Supabase PostgreSQL connection string:

```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-SUPABASE-PROJECT-ID].supabase.co:5432/postgres"
```

You can find this connection string in your Supabase dashboard under Settings > Database.

## Step 3: Create Prisma Schema

Create a `schema.prisma` file with the following content:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Brand {
  id           Int       @id @default(autoincrement())
  brand_url    String
  is_scraped   Boolean   @default(false)
  scrape_notes String?
  products     Product[]
  
  @@map("brands")
}

model Product {
  id                 Int     @id @default(autoincrement())
  brand_id           Int
  product_name       String
  product_description String?
  brand              Brand   @relation(fields: [brand_id], references: [id])
  
  @@map("products")
  @@index([brand_id])
}
```

## Step 4: Generate Prisma Client

Generate the Prisma client based on your schema:

```bash
npx prisma generate
```

## Step 5: Create a Prisma Client Instance

Create a file called `lib/prisma.ts` to initialize and export the Prisma client:

```typescript
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances of Prisma Client in development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```

## Step 6: Create API Routes to Fetch Data

### Fetch All Brands

Create an API route at `pages/api/brands.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        brand_url: true,
        is_scraped: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
    
    res.status(200).json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
}
```

### Fetch Brand Details with Products

Create an API route at `pages/api/brands/[id].ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid brand ID' });
  }
  
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        products: true
      }
    });
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    res.status(200).json(brand);
  } catch (error) {
    console.error(`Error fetching brand ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch brand details' });
  }
}
```

### Fetch Products with Pagination

Create an API route at `pages/api/products.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page = '1', limit = '20', brandId } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;
  
  try {
    const where = brandId ? { brand_id: parseInt(brandId as string) } : {};
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          brand: {
            select: {
              id: true,
              brand_url: true
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      }),
      prisma.product.count({ where })
    ]);
    
    res.status(200).json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        page: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
```

## Step 7: Create Frontend Components

### Brand List Component

Create a component to display all brands:

```tsx
// components/BrandList.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Brand = {
  id: number;
  brand_url: string;
  is_scraped: boolean;
  _count: {
    products: number;
  };
};

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch('/api/brands');
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBrands();
  }, []);
  
  if (loading) return <div>Loading brands...</div>;
  
  return (
    <div className="brand-list">
      <h2>All Brands ({brands.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">
              <Link href={`/brands/${brand.id}`}>
                Brand #{brand.id}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 truncate">{brand.brand_url}</p>
            <div className="mt-2 flex justify-between">
              <span className={`px-2 py-1 rounded text-xs ${brand.is_scraped ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {brand.is_scraped ? 'Scraped' : 'Not Scraped'}
              </span>
              <span className="text-sm">{brand._count.products} products</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Brand Detail Component

Create a component to display brand details with its products:

```tsx
// components/BrandDetail.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type Product = {
  id: number;
  product_name: string;
  product_description: string | null;
};

type Brand = {
  products: Product[id , product_name, product_description];
};

export default function BrandDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    async function fetchBrandDetails() {
      try {
        const response = await fetch(`/api/brands/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch brand details');
        }
        const data = await response.json();
        setBrand(data);
      } catch (error) {
        console.error('Error fetching brand details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBrandDetails();
  }, [id]);
  
  if (loading) return <div>Loading brand details...</div>;
  if (!brand) return <div>Brand not found</div>;
  
  return (
    <div className="brand-detail">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Brand #{brand.id}</h1>
        <a href={brand.brand_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {brand.brand_url}
        </a>
        <div className="mt-2">
          <span className={`px-2 py-1 rounded text-xs ${brand.is_scraped ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {brand.is_scraped ? 'Scraped' : 'Not Scraped'}
          </span>
        </div>
        {brand.scrape_notes && (
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <h3 className="text-sm font-semibold">Scrape Notes:</h3>
            <p className="text-sm">{brand.scrape_notes}</p>
          </div>
        )}
      </div>
      
      <div className="products-section">
        <h2 className="text-xl font-semibold mb-4">Products ({brand.products.length})</h2>
        {brand.products.length === 0 ? (
          <p>No products found for this brand.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brand.products.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow">
                <h3 className="font-medium">{product.product_name}</h3>
                {product.product_description && (
                  <p className="text-sm text-gray-600 mt-2">{product.product_description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Products List with Pagination

Create a component to display products with pagination:

```tsx
// components/ProductsList.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  product_name: string;
  product_description: string | null;
  brand: {
    id: number;
    brand_url: string;
  };
};

type PaginationInfo = {
  total: number;
  pages: number;
  page: number;
  limit: number;
};

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?page=${currentPage}&limit=20`);
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [currentPage]);
  
  if (loading && !products.length) return <div>Loading products...</div>;
  
  return (
    <div className="products-list">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h3 className="font-medium">{product.product_name}</h3>
            {product.product_description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.product_description}</p>
            )}
            <div className="mt-3 text-xs text-gray-500">
              <Link href={`/brands/${product.brand.id}`}>
                <span className="hover:underline">Brand #{product.brand.id}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {pagination && (
        <div className="pagination flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.pages))}
            disabled={currentPage === pagination.pages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

## Step 8: Create Pages


### Brand Detail Page

Create a brand detail page at `pages/brands/[id].tsx`:

```tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BrandDetail from '../../components/BrandDetail';

export default function BrandDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Brand #{id} Details</title>
        <meta name="description" content={`View details and products for brand #${id}`} />
      </Head>
      
      <div className="mb-4">
        <Link href="/">
          <span className="text-blue-600 hover:underline">← Back to all brands</span>
        </Link>
      </div>
      
      <BrandDetail />
    </div>
  );
}
```

### Products Page

Create a products page at `pages/products.tsx`:

```tsx
import Head from 'next/head';
import Link from 'next/link';
import ProductsList from '../components/ProductsList';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>All Products</title>
        <meta name="description" content="Browse all products in our database" />
      </Head>
      
      <div className="mb-4">
        <Link href="/">
          <span className="text-blue-600 hover:underline">← Back to brands</span>
        </Link>
      </div>
      
      <ProductsList />
    </div>
  );
}
```

## Additional Considerations

1. **Authentication**: Consider adding authentication using Next-Auth or Supabase Auth
2. **Caching**: Implement SWR or React Query for efficient data fetching and caching
3. **Search Functionality**: Reconsider search capabilities to find brands or products
4. **Analytics**: Integrate analytics to track user behavior for admin dashboard
5. **Testing**: Add unit and integration tests for your components and API routes

## Troubleshooting

If you encounter issues:
1. Check your database connection string
2. Verify that your Prisma schema matches your Supabase database structure
3. Check for any type errors in your TypeScript code
4. Ensure your API routes are correctly handling errors 