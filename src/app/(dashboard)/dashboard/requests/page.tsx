import { SidebarInset } from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock data for requests
const mockRequests = [
  { id: 1, title: "Add payment gateway", brand: "Amazon", status: "pending", created: "2023-03-20" },
  { id: 2, title: "Improve search functionality", brand: "Google", status: "approved", created: "2023-03-18" },
  { id: 3, title: "Fix mobile responsiveness", brand: "Apple", status: "in-progress", created: "2023-03-15" },
  { id: 4, title: "Add dark mode", brand: "Microsoft", status: "completed", created: "2023-03-10" },
  { id: 5, title: "Implement social login", brand: "Facebook", status: "pending", created: "2023-03-05" },
];

export default function RequestsPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <div className="flex flex-1 flex-col overflow-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Product Requests</h1>
              <Button>New Request</Button>
            </div>
            
            <div className="rounded-lg border">
              <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-1">ID</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Brand</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Created</div>
              </div>
              
              {mockRequests.map((request) => (
                <Link 
                  href={`/dashboard/requests/${request.id}`} 
                  key={request.id}
                  className="grid grid-cols-12 gap-2 border-b p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="col-span-1">#{request.id}</div>
                  <div className="col-span-5 font-medium">{request.title}</div>
                  <div className="col-span-2">{request.brand}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'}`
                    }>
                      {request.status}
                    </span>
                  </div>
                  <div className="col-span-2">{request.created}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
} 