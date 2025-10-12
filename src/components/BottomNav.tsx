import { Home, Search, LineChart, TrendingUp, User } from 'lucide-react'

export default function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search', active: false },
    { icon: LineChart, label: 'Crypto', active: false },
    { icon: TrendingUp, label: 'Investing', active: false },
    { icon: User, label: 'Account', active: false },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-900 md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center flex-1 h-full bg-transparent ${
              item.active ? 'text-white' : 'text-gray-500'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
