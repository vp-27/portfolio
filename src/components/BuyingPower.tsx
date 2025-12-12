import { MousePointerClick } from 'lucide-react'

export default function BuyingPower() {
  return (
    <div className="py-3 border-b border-[#2D2D2D]">
      <div className="w-full flex items-center justify-between py-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Timeline</span>
          <MousePointerClick className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">Tap milestones to explore</span>
        </div>
      </div>
    </div>
  )
}
