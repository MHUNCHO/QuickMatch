'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/tournament', label: 'Tournament Generator' },
    { href: '/sessions', label: 'My Sessions' },
    { href: '/rankings', label: 'Rankings' },
    { href: '/history', label: 'History' },
    { href: '/report', label: 'Report' },
    { href: '/record-match', label: 'Record Match' },
    { href: '/finance', label: 'Finance' },
    { href: '/club-settings', label: 'Club Settings' },
  ]

  return (
    <div className={`${isHomePage ? 'bg-transparent' : 'bg-white shadow-sm'} border-b ${isHomePage ? 'border-transparent' : 'border-slate-200'} sticky top-0 z-50`}>
      {/* Top Header Bar */}
      <div className={`${isHomePage ? 'border-transparent' : 'border-b border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Left Side */}
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 ${isHomePage ? 'bg-white/20' : 'bg-slate-300'} rounded-full flex items-center justify-center`}>
                <svg className={`w-4 h-4 ${isHomePage ? 'text-white' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className={`w-px h-4 ${isHomePage ? 'bg-white/30' : 'bg-slate-300'}`}></div>
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isHomePage ? 'text-white' : 'text-slate-700'}`}>Test Club</span>
                <svg className={`w-4 h-4 ${isHomePage ? 'text-white/70' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isHomePage ? 'text-white' : 'text-slate-700'}`}>US</span>
                <svg className={`w-4 h-4 ${isHomePage ? 'text-white/70' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button className={`p-2 ${isHomePage ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700'} transition-colors`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM9 7v10M9 7h6M9 17h6" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">T</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Hidden on Home Page */}
      {!isHomePage && (
        <nav className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    pathname === item.href
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
