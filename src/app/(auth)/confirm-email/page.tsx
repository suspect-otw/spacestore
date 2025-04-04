import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EnvelopeOpenIcon, CheckCircledIcon, StarIcon } from '@radix-ui/react-icons';
import Navbar from '@/components/Navbar';
export default function ConfirmEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Navbar />
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <EnvelopeOpenIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Account Created Successfully!</h1>
          <p className="text-muted-foreground">
            Please check your email for a confirmation link to complete your registration.
          </p>
        </div>

        <div className="space-y-4 rounded-lg bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircledIcon className="mt-0.5 h-5 w-5 text-primary" />
            <div className="space-y-1">
              <p className="font-medium">Check your inbox</p>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation email to the address you provided.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircledIcon className="mt-0.5 h-5 w-5 text-primary" />
            <div className="space-y-1">
              <p className="font-medium">Check your spam folder</p>
              <p className="text-sm text-muted-foreground">
                If you don't see the email in your inbox, please check your spam or junk folder.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <StarIcon className="mt-0.5 h-5 w-5 text-primary" />
            <div className="space-y-1">
              <p className="font-medium">What happens next?</p>
              <p className="text-sm text-muted-foreground">
                After clicking the confirmation link, you'll be automatically logged in to your new account.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild variant="outline">
              <Link href="/login">Return to login</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">Return to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
