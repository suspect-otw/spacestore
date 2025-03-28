export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was a problem processing your email verification link.
          This could happen if the link expired or was already used.
        </p>
        <div className="space-y-4">
          <p>Please try the following:</p>
          <ul className="list-disc text-left pl-6 space-y-2">
            <li>Log in using your email and password</li>
            <li>If you cannot log in, try the password reset option</li>
            <li>If problems persist, contact support</li>
          </ul>
        </div>
        <div className="mt-8">
          <a 
            href="/login" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Return to Login
          </a>
        </div>
      </div>
    </div>
  )
} 