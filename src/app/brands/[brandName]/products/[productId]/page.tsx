import Link from 'next/link';
import { getBrandByName, getProductById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ brandName: string; productId: string }> 
}) {
  const { brandName, productId } = await params;
  const brand = getBrandByName(brandName);
  if (!brand) {
    notFound();
  }

  const product = getProductById(parseInt(productId));
  if (!product || product.brandId !== brand.brandId) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/brands/${brandName.toLowerCase()}`} className="text-primary hover:text-primary/80">
            ← Back to {brand.brandName} Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-secondary/20 rounded-lg h-96 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">{product.productName[0]}</span>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.productName}</h1>
            <p className="text-slate text-lg mb-6">{product.productDescription}</p>

            {/* Request Button */}
            <div className="mt-8">
              <Link
                href="/signin"
                className="btn-primary inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Request Product
              </Link>
              <p className="text-sm text-slate mt-2">
                Sign in to request this product
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 