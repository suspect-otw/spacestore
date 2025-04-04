import { getBrandById, getBrandByName, getProductById } from '../../../../../../lib/data-service';
import { notFound } from 'next/navigation';
import { ServerError, ProductDetailClient} from '../../../../../../components';

// Helper function to render product details or error
async function renderProductPageContent(params: { brandName: string; productId: string }) {
  try {
    const { brandName, productId } = params;
    
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

    const product = await getProductById(parseInt(productId));
    if (!product || product.brandId !== brand.brandId) {
      console.error(`Product not found or doesn't belong to brand: ${productId}`);
      notFound();
    }
    
    const cleanBrandName = brand.brandName.replace(/^www\./i, '');

    // Return the client component with fetched data
    return (
      <ProductDetailClient 
        product={product} 
        brand={brand}
        cleanBrandName={cleanBrandName}
      />
    );
  } catch (error) {
    console.error('Error rendering ProductPage content:', error);
    // Return ServerError on failure
    return <ServerError message="Error loading product details. Please try again later." />;
  }
}

// Main page component with layout
export default async function ProductPageWrapper({ 
  params: paramsProp // Prop is potentially a Promise
}: { 
  params: Promise<{ brandName: string; productId: string }> // Correct type hint for the prop
}) {
  // Await the params Promise before passing to the render function
  const resolvedParams = await paramsProp;
  const pageContent = await renderProductPageContent(resolvedParams);

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow">
        {pageContent} {/* Render ProductDetailClient or ServerError */}
      </main>

    </div>
  );
} 