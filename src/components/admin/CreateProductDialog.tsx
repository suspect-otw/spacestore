'use client';

import { useState, useEffect } from 'react';
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
import { createProduct } from '@/actions/admin';
import { useRef } from 'react';

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateProductDialog({ open, onOpenChange, onSuccess }: CreateProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open && formRef.current) {
      formRef.current.reset();
    }
  }, [open]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      }
      
      // Create the product
      const result = await createProduct(productData);
      
      if (result.status !== "success") {
        toast.error(result.message || "Failed to create product");
      } else {
        toast.success('Product created successfully');
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating product:', error);
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
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to the system.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product_name" className="text-right">
                Product Name
              </Label>
              <Input
                id="product_name"
                name="product_name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product_description" className="text-right">
                Description
              </Label>
              <Textarea
                id="product_description"
                name="product_description"
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
                  defaultValue="none"
                  name="brandId"
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
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
