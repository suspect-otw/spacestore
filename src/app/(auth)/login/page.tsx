import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <div className="flex-1 grid min-h-[calc(100vh-4rem)] lg:grid-cols-2 w-full">
        <div className="flex flex-col p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md lg:max-w-lg">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <img
            src="/login.svg"
            alt="Login Illustration"
            className="absolute inset-0 h-full w-full object-contain p-6"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
