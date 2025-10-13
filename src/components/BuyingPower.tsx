import { ChevronDown, HelpCircle } from 'lucide-react'

export default function BuyingPower() {
  return (
    <div className="py-3 px-4 md:px-0 border-b border-[#2D2D2D]">
      <button className="w-full flex items-center justify-between bg-transparent hover:bg-[#1A1A1A] py-2 px-2 -mx-2 rounded transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Core Expertise</span>
          <HelpCircle className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">Full-Stack • Data • Finance</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </button>
    </div>
  )
}
