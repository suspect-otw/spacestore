import { Brand, Product } from '@/types';

export const mockBrands: Brand[] = [
  {
    brandId: 1,
    brandName: 'TechCorp',
    brandImage: '/brands/tech.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    brandId: 2,
    brandName: 'FashionHub',
    brandImage: '/brands/fashion.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    brandId: 3,
    brandName: 'SportsPro',
    brandImage: '/brands/sports.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  }
];

export const mockProducts: Product[] = [
  {
    productId: 1,
    brandId: 1,
    productName: 'Smart Laptop',
    productImage: '/products/laptop.jpg',
    productDescription: 'High-performance laptop for professionals',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    productId: 2,
    brandId: 1,
    productName: 'Wireless Earbuds',
    productImage: '/products/earbuds.jpg',
    productDescription: 'Premium wireless audio experience',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    productId: 3,
    brandId: 2,
    productName: 'Designer Jacket',
    productImage: '/products/jacket.jpg',
    productDescription: 'Stylish winter wear',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    productId: 4,
    brandId: 2,
    productName: 'Premium Sneakers',
    productImage: '/products/sneakers.jpg',
    productDescription: 'Comfortable and trendy footwear',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    productId: 5,
    brandId: 3,
    productName: 'Pro Basketball',
    productImage: '/products/basketball.jpg',
    productDescription: 'Competition-grade basketball',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    productId: 6,
    brandId: 3,
    productName: 'Training Kit',
    productImage: '/products/kit.jpg',
    productDescription: 'Complete training equipment set',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system'
  }
];

// Helper function to get brand by name (case-insensitive)
export function getBrandByName(brandName: string): Brand | undefined {
  return mockBrands.find(
    brand => brand.brandName.toLowerCase() === brandName.toLowerCase()
  );
}

// Helper function to get products by brand ID
export function getProductsByBrandId(brandId: number): Product[] {
  return mockProducts.filter(product => product.brandId === brandId);
}

// Helper function to get product by ID
export function getProductById(productId: number): Product | undefined {
  return mockProducts.find(product => product.productId === productId);
}

// Helper function to get brand by ID
export function getBrandById(brandId: number): Brand | undefined {
  return mockBrands.find(brand => brand.brandId === brandId);
} 