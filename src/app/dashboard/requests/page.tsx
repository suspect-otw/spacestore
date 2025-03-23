import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PrivatePage() {
    return (
      <p className="flex min-h-screen flex-col items-center justify-between p-24">
        Requests
        <Link href={"/dashboard"}>
      <Button>
          Dashboard
      </Button>
        </Link>
      </p>
    );
  }
  