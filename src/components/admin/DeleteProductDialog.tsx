'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { deleteProduct } from '@/actions/admin';

interface Product {
  id: number;
  product_name: string;
}

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export function DeleteProductDialog({ 
  open, 
  onOpenChange, 
  product, 
  onSuccess 
}: DeleteProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleDelete = async () => {
    if (!product) {
      toast.error('No product selected for deletion');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await deleteProduct(product.id);
      
      if (result.status !== "success") {
        toast.error(result.message || "Failed to delete product");
      } else {
        toast.success('Product deleted successfully');
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
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
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
