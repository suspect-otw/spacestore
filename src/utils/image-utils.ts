/**
 * Utility functions for generating placeholder images
 */

/**
 * Generate a placeholder image URL with text overlay
 * 
 * @param width Image width
 * @param height Image height
 * @param bgColor Background color (hex or CSS color name)
 * @param textColor Text color (hex or CSS color name)
 * @param text Text to display on the image
 * @param format Image format (svg, png, jpeg, etc.)
 * @returns Placeholder image URL
 */
export function getPlaceholderImage({
  width = 400,
  height = 300,
  bgColor = '6366F1', // Indigo color
  textColor = 'FFFFFF',
  text,
  format = 'svg'
}: {
  width?: number;
  height?: number;
  bgColor?: string;
  textColor?: string;
  text?: string;
  format?: 'svg' | 'png' | 'jpeg' | 'jpg' | 'gif' | 'webp' | 'avif';
} = {}): string {
  // Base URL with size
  let url = `https://placehold.co/${width}x${height}`;
  
  // Add colors
  url += `/${bgColor}/${textColor}`;
  
  // Add format
  url += `.${format}`;
  
  // Add text if specified
  if (text) {
    // Use proper space encoding for the placehold.co API
    url += `?text=${encodeURIComponent(text)}`;
  }
  
  return url;
}

/**
 * Generate a brand image placeholder
 * 
 * @param brandName Brand name
 * @param width Image width
 * @param height Image height
 * @returns Brand image URL
 */
export function getBrandImagePlaceholder(brandName: string, width = 400, height = 300): string {
  return getPlaceholderImage({
    width,
    height,
    text: brandName,
    bgColor: '6366F1',
    textColor: 'FFFFFF',
    format: 'png'
  });
}

/**
 * Generate a product image placeholder
 * 
 * @param productName Product name
 * @param width Image width
 * @param height Image height
 * @returns Product image URL
 */
export function getProductImagePlaceholder(productName: string, width = 400, height = 300): string {
  // Define a set of background colors for products
  const productColors = ['8B5CF6', '3B82F6', '10B981', 'F59E0B', 'EF4444', 'EC4899'];
  const colorIndex = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % productColors.length;
  const bgColor = productColors[colorIndex];
  // Truncate product name if too long
  const truncatedName = productName.length > 30 ? productName.substring(0, 27) + '...' : productName;
  return getPlaceholderImage({
    width,
    height,
    text: truncatedName,
    bgColor,
    textColor: 'FFFFFF',
    format: 'png'
  });
}

/**
 * Supabase Storage'dan rastgele bir görsel URL'si döndürür
 * @param id ID veya text değeri - hash için kullanılır
 * @returns Rastgele bir görsel URL'si
 */
export function getRandomImageFromStorage(id: string | number): string {
  // ID'yi string'e çevir
  const idStr = id.toString();
  
  // Basit bir hash fonksiyonu - aynı ID için hep aynı görseli döndürecek
  const hash = Array.from(idStr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageNumber = (hash % 40) + 1; // 1-40 arası
  
  // Supabase Storage URL'si - Bu URL'yi kendi Supabase config'inizle değiştirin
  // TODO: Bu URL'yi .env dosyasından alın
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.com";
  return `${storageUrl}/storage/v1/object/public/images/${imageNumber}.jpg`;
} 