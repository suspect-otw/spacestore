export default function ConfirmEmailPage() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-muted-foreground">
          We've sent a confirmation link to your email address.
          Please check your inbox and click the link to verify your account.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            If you don't see the email, check your spam folder or{" "}
            <a href="/login" className="text-primary hover:underline">
              return to login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
