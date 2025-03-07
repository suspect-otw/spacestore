import { getBrandById, getBrandByName, getProductById } from '../../../../../lib/data-service';
import { notFound } from 'next/navigation';
import { ServerError, ProductDetailClient } from '../../../../../components';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ brandName: string; productId: string }> 
}) {
  try {
    const { brandName, productId } = await params;
    
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

    const product = await getProductById(parseInt(productId));
    if (!product || product.brandId !== brand.brandId) {
      console.error(`Product not found or doesn't belong to brand: ${productId}`);
      notFound();
    }
    
    // Clean brand name (remove www. if present)
    const cleanBrandName = brand.brandName.replace(/^www\./i, '');

    return (
      <ProductDetailClient 
        product={product} 
        brand={brand}
        cleanBrandName={cleanBrandName}
      />
    );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    return <ServerError message="Error loading product details. Please try again later." />;
  }
} 