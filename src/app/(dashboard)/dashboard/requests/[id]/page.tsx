import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"

// Mock data for requests
const mockRequests = [
  { 
    id: 1, 
    title: "Add payment gateway", 
    brand: "Amazon", 
    status: "pending", 
    created: "2023-03-20",
    description: "We need to implement a secure payment gateway that supports multiple currencies and payment methods. This should include credit cards, PayPal, and local payment options.",
    requester: "John Smith",
    priority: "High",
    category: "Feature",
    assignee: "Alex Johnson",
    comments: [
      { id: 1, author: "Jane Doe", date: "2023-03-21", text: "I think we should use Stripe for this." },
      { id: 2, author: "Alex Johnson", date: "2023-03-22", text: "I agree, Stripe offers the most comprehensive solution for our needs." }
    ]
  },
  { 
    id: 2, 
    title: "Improve search functionality", 
    brand: "Google", 
    status: "approved", 
    created: "2023-03-18",
    description: "The current search functionality is too basic. We need to implement advanced filters, faceted search, and better relevance ranking.",
    requester: "Emily Chen",
    priority: "Medium",
    category: "Enhancement",
    assignee: "Michael Brown",
    comments: [
      { id: 1, author: "Michael Brown", date: "2023-03-19", text: "Let's implement Elasticsearch for this." }
    ]
  },
  { 
    id: 3, 
    title: "Fix mobile responsiveness", 
    brand: "Apple", 
    status: "in-progress", 
    created: "2023-03-15",
    description: "The application is not displaying correctly on mobile devices. We need to fix the layout issues and ensure a consistent experience across all device sizes.",
    requester: "Robert Lee",
    priority: "High",
    category: "Bug",
    assignee: "Sarah Wilson",
    comments: []
  },
  { 
    id: 4, 
    title: "Add dark mode", 
    brand: "Microsoft", 
    status: "completed", 
    created: "2023-03-10",
    description: "Implement a dark mode option for the application UI to reduce eye strain and provide a modern look and feel.",
    requester: "David Garcia",
    priority: "Low",
    category: "Enhancement",
    assignee: "Lisa Taylor",
    comments: [
      { id: 1, author: "Lisa Taylor", date: "2023-03-12", text: "I've implemented this using CSS variables. Please review." },
      { id: 2, author: "David Garcia", date: "2023-03-13", text: "Looks great! Just a few minor tweaks needed." },
      { id: 3, author: "Lisa Taylor", date: "2023-03-14", text: "Changes implemented. Ready for final review." }
    ]
  },
  { 
    id: 5, 
    title: "Implement social login", 
    brand: "Facebook", 
    status: "pending", 
    created: "2023-03-05",
    description: "Add social login options including Google, Facebook, and Twitter to simplify the authentication process for users.",
    requester: "Michelle Wong",
    priority: "Medium",
    category: "Feature",
    assignee: "Unassigned",
    comments: [
      { id: 1, author: "Michelle Wong", date: "2023-03-07", text: "Can we prioritize Google login first?" }
    ]
  },
];

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const requestId = parseInt(params.id);
  const request = mockRequests.find(r => r.id === requestId);
  
  if (!request) {
    notFound();
  }
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-auto p-6">
            <div className="mb-6">
              <Link href="/dashboard/requests" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to requests
              </Link>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">{request.title}</h1>
                  <p className="text-sm text-muted-foreground">Request #{request.id} • Created on {request.created}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                    ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'}`
                  }>
                    {request.status}
                  </span>
                  <Button variant="outline">Edit</Button>
                  <Button>Update Status</Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="rounded-lg border">
                  <div className="border-b p-4">
                    <h2 className="font-semibold">Description</h2>
                  </div>
                  <div className="p-4">
                    <p>{request.description}</p>
                  </div>
                </div>
                
                <div className="mt-6 rounded-lg border">
                  <div className="border-b p-4">
                    <h2 className="font-semibold">Comments ({request.comments.length})</h2>
                  </div>
                  {request.comments.length > 0 ? (
                    <div className="divide-y">
                      {request.comments.map(comment => (
                        <div key={comment.id} className="p-4">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No comments yet
                    </div>
                  )}
                  <div className="border-t p-4">
                    <textarea 
                      className="w-full rounded-md border p-2 text-sm" 
                      rows={3} 
                      placeholder="Add a comment..."
                    />
                    <div className="mt-2 flex justify-end">
                      <Button size="sm">Post Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="rounded-lg border">
                  <div className="border-b p-4">
                    <h2 className="font-semibold">Details</h2>
                  </div>
                  <div className="divide-y">
                    <div className="flex justify-between p-4">
                      <span className="text-sm text-muted-foreground">Brand</span>
                      <span className="font-medium">{request.brand}</span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-sm text-muted-foreground">Requester</span>
                      <span className="font-medium">{request.requester}</span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-sm text-muted-foreground">Assignee</span>
                      <span className="font-medium">{request.assignee}</span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-sm text-muted-foreground">Priority</span>
                      <span className="font-medium">{request.priority}</span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="font-medium">{request.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
} 