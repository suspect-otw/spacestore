'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SimpleBrandSelect } from './SimpleBrandSelect';
import { toast } from 'sonner';
import { updateProduct } from '@/actions/admin';

interface Product {
  id: number;
  product_name: string;
  product_description: string | null;
  brand_id: number | null;
  brands?: {
    id: number;
    brand_name: string;
  };
}

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export function EditProductDialog({ 
  open, 
  onOpenChange, 
  product, 
  onSuccess 
}: EditProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Reset form when product changes
  useEffect(() => {
    if (open && product && formRef.current) {
      // Allow time for the form to render before resetting
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 100);
    }
  }, [open, product]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!product) {
      toast.error('No product selected for editing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const productName = formData.get('product_name') as string;
      const productDescription = formData.get('product_description') as string;
      const brandId = formData.get('brandId') as string;
      
      console.log('Form data:', { productName, productDescription, brandId });
      
      if (!productName.trim()) {
        toast.error('Product name is required');
        setIsSubmitting(false);
        return;
      }
      
      // Create product data object
      const productData: any = {
        product_name: productName,
        product_description: productDescription || null,
      };
      
      // Only add brand_id if it's not 'none'
      if (brandId && brandId !== 'none') {
        productData.brand_id = Number(brandId);
      } else {
        productData.brand_id = null;
      }
      
      // Update the product
      const result = await updateProduct(product.id, productData);
      
      if (result.status !== "success") {
        toast.error(result.message || "Failed to update product");
      } else {
        toast.success('Product updated successfully');
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen && !isSubmitting) {
          onOpenChange(newOpen);
        }
      }}
      modal={true}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product information below.
          </DialogDescription>
        </DialogHeader>
        {product && (
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_product_name" className="text-right">
                  Product Name
                </Label>
                <Input
                  id="edit_product_name"
                  name="product_name"
                  defaultValue={product.product_name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_product_description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit_product_description"
                  name="product_description"
                  defaultValue={product.product_description || ''}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brandId" className="text-right">
                  Brand
                </Label>
                <div className="col-span-3">
                  <SimpleBrandSelect 
                    defaultValue={product.brand_id ? product.brand_id.toString() : 'none'}
                    name="brandId"
                    defaultLabel={product.brands?.brand_name || 'None'}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
