import { Search, Bell, User } from 'lucide-react'

export default function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black border-b border-gray-900 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#00C805] rounded-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z" />
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#1A1A1A] text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-[#C4F000] text-black rounded-full text-sm font-medium hover:bg-[#b3e000] transition-colors">
              Robinhood Legend
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
            <button className="text-white text-sm hover:text-gray-300 transition-colors">Rewards</button>
            <button className="text-white text-sm hover:text-gray-300 transition-colors">Investing</button>
            <button className="text-white text-sm hover:text-gray-300 transition-colors">Crypto</button>
            <button className="text-white text-sm hover:text-gray-300 transition-colors">Spending</button>
            <button className="text-white text-sm hover:text-gray-300 transition-colors">Retirement</button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 ml-4">
            <button className="text-gray-400 hover:text-white transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
