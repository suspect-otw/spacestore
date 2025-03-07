import { getBrandById, getBrandByName, getProductsByBrandId } from '../../../lib/data-service';
import { notFound } from 'next/navigation';
import Pagination from '../../../components/Pagination';
import ServerError from '../../../components/ServerError';
import Breadcrumbs from '../../../components/Breadcrumbs';
import ProductCard from '../../../components/ProductCard';
import { getBrandImagePlaceholder } from '../../../utils/image-utils';

export default async function BrandPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ brandName: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { brandName } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  
  try {
    // Decode the URL-encoded parameter
    const decodedParam = decodeURIComponent(brandName);
    let brand;
    
    // Check if the URL is in the new format (contains a dash)
    if (decodedParam.includes('-')) {
      // Extract the brand id from the parameter
      const [brandIdStr] = decodedParam.split('-');
      const brandId = Number(brandIdStr);
      if (isNaN(brandId)) {
        console.error(`Invalid brand id in URL param: ${decodedParam}`);
        notFound();
      }
      
      // Fetch brand using brand id
      brand = await getBrandById(brandId);
    } else {
      // Fall back to the old method of fetching by name
      brand = await getBrandByName(decodedParam);
    }
    
    if (!brand) {
      console.error(`Brand not found: ${decodedParam}`);
      notFound();
    }

    const productsData = await getProductsByBrandId(brand.brandId, currentPage);
    
    // Generate a placeholder image for the brand
    const brandImageUrl = getBrandImagePlaceholder(brand.brandName, 600, 300);

    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs brandName={brand.brandName} brandId={brand.brandId} />
          </div>
          
          {/* Brand Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
            <div 
              className="h-64 w-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${brandImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{brand.brandName}</h1>
              {brand.brandDescription && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">{brand.brandDescription}</p>
              )}
              <div className="mt-4 flex items-center">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                  {productsData.totalProducts} {productsData.totalProducts === 1 ? 'product' : 'products'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          {productsData.products.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">Products</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productsData.products.map((product) => (
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

              {/* Pagination */}
              {productsData.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={productsData.totalPages}
                    basePath={`/brands/${brand.brandId}-${encodeURIComponent(brand.brandName)}`}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">No products found for this brand.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error in BrandPage for ${brandName}:`, error);
    return <ServerError message="Error loading brand details. Please try again later." />;
  }
} 