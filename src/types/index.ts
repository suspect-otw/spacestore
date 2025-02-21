export interface Brand {
  brandId: number;
  brandName: string;
  brandImage: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface Product {
  productId: number;
  brandId: number;
  productName: string;
  productImage: string;
  productDescription: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface User {
  userId: number;
  userName: string;
  email: string;
  password: string;
  passwordRefreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  role: 'admin' | 'normal user';
}

export interface Request {
  requestId: number;
  userId: number;
  productId: number;
  brandId: number;
  requestStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// Mock data interfaces
export interface BrandWithProducts extends Brand {
  products: Product[];
} 