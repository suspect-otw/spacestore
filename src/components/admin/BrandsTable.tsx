"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrand, updateBrand, deleteBrand } from "@/actions/admin";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

type Brand = {
  id: number;
  brand_name: string;
  created_at: string;
  updated_at: string;
};

export function BrandsTable({ brands }: { brands: Brand[] }) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    brand_name: ""
  });
  
  const handleCreateClick = () => {
    setFormData({ brand_name: "" });
    setIsCreateDialogOpen(true);
  };
  
  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      brand_name: brand.brand_name
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createBrand({
        brand_name: formData.brand_name
      });
      
      if (result.status === "success") {
        toast.success("Brand created successfully");
        setIsCreateDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to create brand");
      }
    } catch (error) {
      toast.error("An error occurred while creating the brand");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;
    if (!formData.brand_name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updateBrand(selectedBrand.id, {
        brand_name: formData.brand_name
      });
      
      if (result.status === "success") {
        toast.success("Brand updated successfully");
        setIsEditDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to update brand");
      }
    } catch (error) {
      toast.error("An error occurred while updating the brand");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedBrand) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await deleteBrand(selectedBrand.id);
      
      if (result.status === "success") {
        toast.success("Brand deleted successfully");
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to delete brand");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the brand");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Brand Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No brands found</TableCell>
            </TableRow>
          ) : (
            brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.id}</TableCell>
                <TableCell>{brand.brand_name}</TableCell>
                <TableCell>{formatDate(brand.created_at)}</TableCell>
                <TableCell>{formatDate(brand.updated_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(brand)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Create Brand Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
            <DialogDescription>
              Add a new brand to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand_name" className="text-right">
                  Brand Name
                </Label>
                <Input
                  id="brand_name"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
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
      
      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Make changes to the brand information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_brand_name" className="text-right">
                  Brand Name
                </Label>
                <Input
                  id="edit_brand_name"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Brand Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this brand? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
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
    </div>
  );
}
