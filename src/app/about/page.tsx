export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">About ProductReq</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting brands and consumers through innovative product request management.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At ProductReq, we believe in bridging the gap between consumers and brands. 
              Our platform simplifies the product request process, making it easier for 
              users to express their needs and for brands to understand market demands.
            </p>
            <p className="text-muted-foreground">
              We&apos;re committed to creating a transparent, efficient, and user-friendly 
              environment where product requests are handled professionally and promptly.
            </p>
          </div>
          <div className="bg-muted bg-opacity-20 rounded-lg h-64 flex items-center justify-center">
            <span className="text-6xl">🎯</span>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-muted bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-muted-foreground">Building reliable connections between brands and consumers.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-muted bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">Continuously improving our platform and services.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-muted bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Efficiency</h3>
              <p className="text-muted-foreground">Streamlining the product request process.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="pb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'John Doe', role: 'CEO', emoji: '👨‍💼' },
              { name: 'Jane Smith', role: 'CTO', emoji: '👩‍💻' },
              { name: 'Mike Johnson', role: 'Head of Design', emoji: '👨‍🎨' },
              { name: 'Sarah Wilson', role: 'Head of Operations', emoji: '👩‍💼' },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="bg-muted bg-opacity-20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">{member.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 