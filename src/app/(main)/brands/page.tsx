import { getAllBrands, searchBrandsAndProducts } from '../../../lib/data-service';
import SearchBar from '../../../components/SearchBar';
import { Product, Brand } from '../../../types';
import Pagination from '../../../components/Pagination';
import ServerError from '../../../components/ServerError';
import BrandCard from '../../../components/BrandCard';
import ProductCard from '../../../components/ProductCard';
import Breadcrumbs from '../../../components/Breadcrumbs';

// Revert to the original default export structure
export default async function BrandsPage({
  searchParams: searchParamsProp, // Can keep renamed prop
}: {
  searchParams: Promise<{ q?: string; page?: string }>; // Use Promise type
}) {
  // Await the promise here
  const searchParams = await searchParamsProp;
  const { q, page = '1' } = searchParams;
  const searchQuery = q?.toLowerCase();
  const currentPage = parseInt(page, 10) || 1;

  try {
    let brandsData;
    let productsWithBrands: { product: Product; brand: Brand }[] = [];
    const totalProductPages = 1;

    if (searchQuery) {
      const searchResults = await searchBrandsAndProducts(searchQuery, currentPage);
      brandsData = {
        brands: searchResults.brands,
        totalPages: searchResults.totalBrandPages
      };
      productsWithBrands = searchResults.productsWithBrands || [];
    } else {
      brandsData = await getAllBrands(currentPage);
    }

    // Return the page content directly (no layout wrapper)
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          
          {/* Centered heading and search bar */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Brands</h1>
            <p className="mt-2 text-sm text-gray-500">
              Browse all brands or search for specific brands and products
            </p>
            <div className="mt-6 max-w-xl mx-auto">
              <SearchBar initialQuery={q || ''} />
            </div>
          </div>

          {/* Display brands */}
          {brandsData.brands.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-6">
                {searchQuery ? `Brands matching "${searchQuery}"` : 'All Brands'}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {brandsData.brands.map((brand) => (
                  <BrandCard
                    key={brand.brandId}
                    brandId={brand.brandId}
                    brandName={brand.brandName}
                    productCount={brand.productCount}
                  />
                ))}
              </div>

              {/* Pagination for brands */}
              {brandsData.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={brandsData.totalPages}
                    basePath="/brands"
                    queryParams={searchQuery ? { q: searchQuery } : {}}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No brands found.</p>
            </div>
          )}

          {/* Display products if searching */}
          {searchQuery && productsWithBrands.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">
                Products matching &quot;{searchQuery}&quot;
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productsWithBrands.map(({ product, brand }) => (
                  <ProductCard
                    key={product.productId}
                    productId={product.productId}
                    productName={product.productName}
                    brandName={brand.brandName}
                    brandId={brand.brandId}
                    productDescription={product.productDescription}
                  />
                ))}
              </div>

              {/* Pagination for products */}
              {totalProductPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalProductPages}
                    basePath="/brands"
                    queryParams={{ q: searchQuery, type: 'products' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching data for BrandsPage:', error);
    return <ServerError message="Error loading brands or products. Please try again later." />;
  }
} 