import ClientComponent from "@/components/ClientComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Dashboard
      <Link href={"/dashboard/requests"}>
      <Button>
          Requests
      </Button>
        </Link>
      <ClientComponent />
    </main>
  );
}
