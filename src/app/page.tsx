import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Development Mode Indicator - sadece development modunda göster */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-red-600 text-white p-4 text-center text-xl font-bold animate-pulse">
          ⚙️ DEVELOPMENT MODE - TESTING ENVIRONMENT ⚙️
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#BDD4E7] to-[#8693AB] dark:from-[#212227] dark:to-[#637074] py-20">
        {/* Lighting effect circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#AAB9CF]/20 dark:bg-[#8693AB]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8693AB]/20 dark:bg-[#637074]/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#212227] dark:text-white mb-6">
                [DEV] Request Products from Your Favorite Brands
              </h1>
              <p className="text-xl text-[#637074] dark:text-white/80 mb-8">
                Connect with top brands and request the products you need. Simple, efficient, and reliable.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/brands" 
                  className="inline-flex items-center px-8 py-3 rounded-full bg-white/80 text-[#212227] hover:bg-white dark:bg-[#8693AB] dark:text-white dark:hover:bg-[#AAB9CF] transition-all duration-200 backdrop-blur-sm"
                >
                  Browse Brands
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center px-8 py-3 rounded-full text-[#212227] dark:text-white border border-[#212227]/20 dark:border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200"
                >
                  Get Started
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-96 w-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                {/* Add product showcase or illustration here */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gradient-to-t dark:from-[#212227] dark:to-[#637074] py-20">
        {/* Subtle background effects */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#BDD4E7]/10 to-transparent dark:from-[#637074]/5"></div>
        <div className="absolute -left-1/4 top-1/4 w-96 h-96 bg-[#8693AB]/5 dark:bg-[#637074]/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-96 h-96 bg-[#BDD4E7]/5 dark:bg-[#8693AB]/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#212227] dark:text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards with glass effect */}
            <div className="text-center p-8 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#BDD4E7]/20 dark:border-white/10 shadow-lg">
              <div className="bg-gradient-to-br from-[#BDD4E7] to-[#8693AB] dark:from-[#637074] dark:to-[#8693AB] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212227] dark:text-white">Browse Brands</h3>
              <p className="text-[#637074] dark:text-white/70">Explore our curated collection of top brands and their products.</p>
            </div>

            <div className="text-center p-8 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#BDD4E7]/20 dark:border-white/10 shadow-lg">
              <div className="bg-gradient-to-br from-[#BDD4E7] to-[#8693AB] dark:from-[#637074] dark:to-[#8693AB] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212227] dark:text-white">Make Requests</h3>
              <p className="text-[#637074] dark:text-white/70">Submit your product requests easily and securely.</p>
            </div>

            <div className="text-center p-8 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#BDD4E7]/20 dark:border-white/10 shadow-lg">
              <div className="bg-gradient-to-br from-[#BDD4E7] to-[#8693AB] dark:from-[#637074] dark:to-[#8693AB] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212227] dark:text-white">Track Progress</h3>
              <p className="text-[#637074] dark:text-white/70">Monitor your requests and get updates in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#1C1C21] dark:to-[#637074] py-20">
         {/* Background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-96 bg-[#8693AB]/5 dark:bg-[#8693AB]/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-8 rounded-2xl bg-white/50 dark:bg-[#212227]/50 backdrop-blur-sm border border-[#BDD4E7]/20 dark:border-white/10 shadow-lg">
            <h2 className="text-4xl font-bold mb-8 text-[#212227] dark:text-white">Ready to Start?</h2>
            <p className="text-xl text-[#637074] dark:text-white/70 mb-8 max-w-2xl mx-auto">
              Join our community of brand enthusiasts and start making your voice heard. Your product requests can shape the future of your favorite brands.
            </p>
            <Link 
              href="/brands" 
              className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-[#8693AB] to-[#AAB9CF] dark:from-[#637074] dark:to-[#8693AB] text-white hover:opacity-90 transition-all duration-200 shadow-lg"
            >
              Browse Brands
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
