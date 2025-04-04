import { getBrandById, getBrandByName, getProductsByBrandId } from '../../../../lib/data-service';
import { notFound } from 'next/navigation';
import Pagination from '../../../../components/Pagination';
import ServerError from '../../../../components/ServerError';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import ProductCard from '../../../../components/ProductCard';
import { getRandomImageFromStorage } from '../../../../utils/image-utils';


// Helper function to render the actual page content or error state
async function renderBrandPageContent(params: { brandName: string }, searchParams: { page?: string }) {
  const { brandName } = params;
  const { page = '1' } = searchParams;
  const currentPage = parseInt(page, 10) || 1;
  
  try {
    const decodedParam = decodeURIComponent(brandName);
    let brand;
    
    if (decodedParam.includes('-')) {
      const [brandIdStr] = decodedParam.split('-');
      const brandId = Number(brandIdStr);
      if (isNaN(brandId)) {
        console.error(`Invalid brand id in URL param: ${decodedParam}`);
        notFound();
      }
      brand = await getBrandById(brandId);
    } else {
      brand = await getBrandByName(decodedParam);
    }
    
    if (!brand) {
      console.error(`Brand not found: ${decodedParam}`);
      notFound();
    }

    const productsData = await getProductsByBrandId(brand.brandId, currentPage);
    const brandImageUrl = getRandomImageFromStorage(brand.brandId);

    // Return the JSX for successful data load
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs brandName={brand.brandName} brandId={brand.brandId} />
          </div>
          
          {/* Brand Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
            <div className="md:grid md:grid-cols-2 lg:grid-cols-5">
              {/* Brand Image - Takes up 2/5 on large screens */}
              <div className="lg:col-span-2 relative">
                <div 
                  className="h-64 md:h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${brandImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '300px'
                  }}
                />
                {/* Marka adı overlay */}
                <div className="absolute inset-x-0 top-0 flex justify-center items-start pt-3">
                  <span 
                    className="text-black font-bold px-2 max-w-[90%] text-center"
                    style={{ 
                      textShadow: '0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white',
                      fontSize: brand.brandName.length > 25 ? '1.5rem' : brand.brandName.length > 15 ? '1.75rem' : '2rem',
                      wordBreak: 'break-word',
                      lineHeight: '1.2'
                    }}
                  >
                    {brand.brandName}
                  </span>
                </div>
              </div>
              
              {/* Brand Details - Takes up 3/5 on large screens */}
              <div className="p-6 md:p-8 lg:col-span-3">
                <div className="flex flex-col h-full">
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                        {productsData.totalProducts} {productsData.totalProducts === 1 ? 'product' : 'products'}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        Brand ID: {brand.brandId}
                      </span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{brand.brandName}</h1>
                    
                    {brand.brandDescription && (
                      <div className="prose prose-indigo max-w-none mb-8 dark:prose-invert">
                        <p className="text-gray-700 dark:text-gray-300">{brand.brandDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
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
    console.error(`Error rendering BrandPage content for ${brandName}:`, error);
    // Return ServerError component on error
    return <ServerError message="Error loading brand details. Please try again later." />;
  }
}

// Main page component that includes layout
export default async function BrandPageWrapper({ 
  params: paramsProp, // Prop is potentially a Promise
  searchParams: searchParamsProp // Prop is potentially a Promise
}: { 
  params: Promise<{ brandName: string }>; // Correct type hint
  searchParams: Promise<{ page?: string }>; // Correct type hint
}) {
  // Await the Promises before passing to the render function
  const resolvedParams = await paramsProp;
  const resolvedSearchParams = await searchParamsProp;
  const pageContent = await renderBrandPageContent(resolvedParams, resolvedSearchParams);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {pageContent} {/* Render content or error component */}
      </main>
    </div>
  );
} 