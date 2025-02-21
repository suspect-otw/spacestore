import Link from 'next/link';
import { getBrandByName, getProductsByBrandId } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default async function BrandPage({ 
  params 
}: { 
  params: Promise<{ brandName: string }> 
}) {
  const { brandName } = await params;
  const brand = getBrandByName(brandName);
  
  if (!brand) {
    notFound();
  }

  const products = getProductsByBrandId(brand.brandId);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/brands" className="text-primary hover:text-primary/80">
            ← Back to Brands
          </Link>
          <h1 className="text-4xl font-bold mt-4">{brand.brandName} Products</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.productId}
              href={`/brands/${brandName.toLowerCase()}/products/${product.productId}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 group-hover:transform group-hover:scale-105">
                <div className="h-48 bg-secondary/20 relative">
                  {/* Replace with actual image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{product.productName[0]}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark mb-2">{product.productName}</h3>
                  <p className="text-slate">{product.productDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-slate">No products found for this brand.</h2>
          </div>
        )}
      </div>
    </div>
  );
} 