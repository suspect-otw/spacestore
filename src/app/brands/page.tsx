import Link from 'next/link';
import { mockBrands, mockProducts, getBrandById } from '@/lib/mock-data';
import SearchBar from '@/components/SearchBar';

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  let filteredBrands = mockBrands;
  let filteredProducts: typeof mockProducts = [];
  const { q } = await searchParams;
  const searchQuery = q?.toLowerCase();

  if (searchQuery) {
    // Filter brands
    filteredBrands = mockBrands.filter(brand => 
      brand.brandName.toLowerCase().includes(searchQuery)
    );

    // Filter products
    filteredProducts = mockProducts.filter(product => {
      const brand = getBrandById(product.brandId);
      return (
        product.productName.toLowerCase().includes(searchQuery) ||
        product.productDescription.toLowerCase().includes(searchQuery)
      ) && brand;
    });
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8">Our Brands</h1>
          <div className="max-w-xl mx-auto">
            <SearchBar initialQuery={q} />
          </div>
        </div>
        
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-dark mb-4">
              Search Results for &quot;{q}&quot;
            </h2>
          </div>
        )}

        {/* Brands Section */}
        {filteredBrands.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-slate mb-6">
              {filteredBrands.length} Brand{filteredBrands.length !== 1 ? 's' : ''} Found
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBrands.map((brand) => (
                <Link 
                  key={brand.brandId}
                  href={`/brands/${brand.brandName}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 group-hover:transform group-hover:scale-105">
                    <div className="h-48 bg-secondary/20 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{brand.brandName[0]}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-dark mb-2">{brand.brandName}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        {filteredProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-slate mb-6">
              {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const brand = getBrandById(product.brandId);
                if (!brand) return null;
                
                return (
                  <Link
                    key={product.productId}
                    href={`/brands/${brand.brandName}/products/${product.productId}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 group-hover:transform group-hover:scale-105">
                      <div className="h-48 bg-secondary/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">{product.productName[0]}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-dark mb-2">{product.productName}</h3>
                        <p className="text-slate text-sm mb-2">{product.productDescription}</p>
                        <p className="text-xs text-primary">From {brand.brandName}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {searchQuery && filteredBrands.length === 0 && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-slate">No results found matching your search.</h2>
          </div>
        )}
      </div>
    </div>
  );
} 