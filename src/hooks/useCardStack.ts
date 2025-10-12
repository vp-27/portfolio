import { useEffect, useState, useCallback, useRef } from 'react'
import type { Experience, Project, ChartDataPoint } from '../types'

interface StackedCard {
  id: string
  type: 'experience' | 'project'
  data: Experience | Project
  order: number
}

interface UseCardStackOptions {
  experiences: Experience[]
  projects: Project[]
  milestoneMap: Record<string, { type: 'experience' | 'project', id: string }>
  chartData: ChartDataPoint[]
}

export function useCardStack({ experiences, projects, milestoneMap, chartData }: UseCardStackOptions) {
  const [stackedCards, setStackedCards] = useState<StackedCard[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const orderCounter = useRef(0) // Counter that always increments
  const processingCard = useRef<string | null>(null) // Track which card is currently being processed
  const lastTriggered = useRef<string | null>(null) // Track last triggered milestone

  // When user hovers/clicks on chart points, we can trigger cards
  const triggerCardFromMilestone = useCallback((milestone: string) => {
    // Prevent duplicate triggers for the same milestone
    if (processingCard.current === milestone) {
      return
    }

    const mapping = milestoneMap[milestone]
    if (!mapping) return

    // Check if this card is already stacked
    const existingCardIndex = stackedCards.findIndex(
      card => card.type === mapping.type && (card.data as any).id === mapping.id
    )
    
    // If we just triggered this same milestone, skip
    if (lastTriggered.current === milestone && existingCardIndex !== -1) {
      return
    }

    lastTriggered.current = milestone
    processingCard.current = milestone

    // If already stacked, remove it first (we'll re-add it on top)
    if (existingCardIndex !== -1) {
      setStackedCards(prev => prev.filter((_, index) => index !== existingCardIndex))
      // Small delay to allow removal animation, then re-add
      setTimeout(() => {
        addCard(mapping)
        processingCard.current = null
      }, 150)
      return
    }

    addCard(mapping)
    // Reset processing flag after a short delay
    setTimeout(() => {
      processingCard.current = null
    }, 200)
  }, [stackedCards, milestoneMap])

  const addCard = useCallback((mapping: { type: 'experience' | 'project', id: string }) => {
    let data: Experience | Project | undefined
    
    if (mapping.type === 'experience') {
      data = experiences.find(exp => exp.id === mapping.id)
    } else {
      data = projects.find(proj => proj.id === mapping.id)
    }

    if (!data) return

    const newCard: StackedCard = {
      id: `${mapping.type}-${mapping.id}-${Date.now()}`,
      type: mapping.type,
      data,
      order: orderCounter.current++ // Increment counter for each new card
    }

    setStackedCards(prev => [...prev, newCard])
  }, [experiences, projects])

  // Auto-trigger cards as user scrolls through chart milestones
  useEffect(() => {
    const milestones = chartData.filter(point => point.label)
    
    if (activeIndex < milestones.length) {
      const milestone = milestones[activeIndex]
      if (milestone.label) {
        triggerCardFromMilestone(milestone.label)
      }
    }
  }, [activeIndex, chartData, triggerCardFromMilestone])

  const dismissCard = useCallback((cardId: string) => {
    setStackedCards(prev => prev.filter(card => card.id !== cardId))
  }, [])

  const clearAllCards = useCallback(() => {
    setStackedCards([])
    setActiveIndex(0)
    orderCounter.current = 0 // Reset counter when clearing all cards
  }, [])

  const nextMilestone = useCallback(() => {
    const milestones = chartData.filter(point => point.label)
    if (activeIndex < milestones.length - 1) {
      setActiveIndex(prev => prev + 1)
    }
  }, [activeIndex, chartData])

  return {
    stackedCards,
    dismissCard,
    clearAllCards,
    triggerCardFromMilestone,
    nextMilestone,
    activeIndex
  }
}
