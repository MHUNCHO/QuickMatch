import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-6xl font-bold text-white mb-6">
          QuickMatch
        </h1>
        
        {/* Subtitle */}
        <p className="text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
          Simplify your badminton tournament scheduling with fairness and ease
        </p>
        
        {/* Call to Action Button */}
        <Link
          href="/tournament"
          className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/30 hover:border-white/50 hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </main>
  )
}
