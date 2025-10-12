import { useState } from 'react'
import { ChevronUp, ChevronDown, Eye, Plus } from 'lucide-react'
import type { Stock } from '../types'
import StockItem from './StockItem'

interface List {
  id: string
  name: string
  icon: 'eye' | 'potato'
  stocks?: Stock[]
}

interface ListsProps {
  lists: List[]
  stocks: Stock[]
}

export default function Lists({ lists, stocks }: ListsProps) {
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set())

  const toggleList = (listId: string) => {
    const newExpanded = new Set(expandedLists)
    if (newExpanded.has(listId)) {
      newExpanded.delete(listId)
    } else {
      newExpanded.add(listId)
    }
    setExpandedLists(newExpanded)
  }

  const getIcon = (iconType: 'eye' | 'potato') => {
    if (iconType === 'eye') {
      return <Eye className="w-5 h-5" />
    }
    // Potato emoji as fallback
    return <span className="text-lg">🥔</span>
  }

  const getListStocks = (listName: string) => {
    // Return different stocks based on list name
    if (listName === 'Options Watchlist') {
      return []
    }
    // Return subset of stocks for Potato list
    return stocks.slice(0, 5)
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-medium">Lists</h2>
        <button className="bg-transparent text-gray-400 hover:text-white transition-colors" aria-label="Add new list">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div>
        {lists.map((list) => {
          const isExpanded = expandedLists.has(list.id)
          const listStocks = getListStocks(list.name)
          
          return (
            <div key={list.id} className="border-b border-gray-900">
              <button
                onClick={() => toggleList(list.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">
                    {getIcon(list.icon)}
                  </div>
                  <span className="text-white">{list.name}</span>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              
              {isExpanded && listStocks.length > 0 && (
                <div className="bg-black">
                  {listStocks.map((stock) => (
                    <StockItem key={stock.id} stock={stock} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
