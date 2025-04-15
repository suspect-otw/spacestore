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
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { updateRequest, deleteRequest } from "@/actions/admin";
import { Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Request = {
  id: string;
  product_id: number | null;
  product_name: string;
  brand_id: number | null;
  brand_name: string;
  quantity: number;
  user_id: string | null;
  full_name: string;
  country: string;
  address: string;
  post_code: string;
  tel_no: string;
  email: string;
  company_name: string | null;
  created_at: string;
  updated_at: string;
  createdby: string | null;
  updatedby: string | null;
  comment: string | null;
  status: string;
  products?: { id: number; product_name: string };
  brands?: { id: number; brand_name: string };
  user_profiles?: { id: string; fullname: string; email: string };
};

export function RequestsTable({ requests }: { requests: Request[] }) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    status: "",
    comment: ""
  });
  
  const handleViewClick = (request: Request) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };
  
  const handleEditClick = (request: Request) => {
    setSelectedRequest(request);
    setFormData({
      status: request.status,
      comment: request.comment || ""
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (request: Request) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the current user ID for the updatedby field
      // In a real app, you'd get this from auth context
      // For now, we'll use a placeholder
      const currentUserId = selectedRequest.updatedby || "admin-user-id";
      
      const result = await updateRequest(
        selectedRequest.id, 
        {
          status: formData.status,
          comment: formData.comment || null
        },
        currentUserId
      );
      
      if (result.status === "success") {
        toast.success("Request updated successfully");
        setIsEditDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to update request");
      }
    } catch (error) {
      toast.error("An error occurred while updating the request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await deleteRequest(selectedRequest.id);
      
      if (result.status === "success") {
        toast.success("Request deleted successfully");
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to delete request");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">No requests found</TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-xs">
                  {request.id.substring(0, 8)}...
                </TableCell>
                <TableCell>{request.product_name}</TableCell>
                <TableCell>{request.brand_name}</TableCell>
                <TableCell>{request.full_name}</TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>{formatDate(request.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewClick(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(request)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(request)}
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
      
      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Detailed information about this request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Product Information</h3>
                <p><span className="font-medium">Product:</span> {selectedRequest.product_name}</p>
                <p><span className="font-medium">Brand:</span> {selectedRequest.brand_name}</p>
                <p><span className="font-medium">Quantity:</span> {selectedRequest.quantity}</p>
                <p><span className="font-medium">Status:</span> {selectedRequest.status}</p>
                {selectedRequest.comment && (
                  <p><span className="font-medium">Comment:</span> {selectedRequest.comment}</p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Customer Information</h3>
                <p><span className="font-medium">Name:</span> {selectedRequest.full_name}</p>
                <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedRequest.tel_no}</p>
                <p><span className="font-medium">Country:</span> {selectedRequest.country}</p>
                <p><span className="font-medium">Address:</span> {selectedRequest.address}</p>
                <p><span className="font-medium">Post Code:</span> {selectedRequest.post_code}</p>
                {selectedRequest.company_name && (
                  <p><span className="font-medium">Company:</span> {selectedRequest.company_name}</p>
                )}
              </div>
              <div className="col-span-2 space-y-2">
                <h3 className="font-semibold">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p><span className="font-medium">Created:</span> {new Date(selectedRequest.created_at).toLocaleString()}</p>
                  <p><span className="font-medium">Updated:</span> {new Date(selectedRequest.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Request Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Update the status and add comments to this request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">
                  Comment
                </Label>
                <Textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                  placeholder="Add a comment about this request"
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
      
      {/* Delete Request Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this request? This action cannot be undone.
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
