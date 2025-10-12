# Card Stack Feature - Mobile Interactive Timeline

## Overview
Implemented an interactive card stacking system for mobile that creates a **visual narrative** connecting the portfolio chart milestones with detailed experience/project cards.

## How It Works

### User Experience (Mobile Only)
1. **About Me Section** is positioned directly under the chart on mobile
2. When users **click/tap on chart milestone dots**, corresponding experience/project cards **stack over the About Me section**
3. Cards stack with a **physical card effect** - slight offset, scaling, and rotation
4. Users can **dismiss individual cards** using the X button in the top-right corner
5. Creates a **guided exploration** of the professional timeline

### Desktop Behavior
- **Not shown on desktop** - only active on mobile/tablet viewports (`lg:hidden`)
- Desktop retains the traditional side-by-side layout

## Technical Implementation

### Components Created

#### 1. `CardStack.tsx`
- Renders stacked cards as a **fixed overlay** (pointer-events-none container)
- Uses **Framer Motion** for smooth animations:
  - Entry: scale + opacity fade-in
  - Exit: slide-out to the right
  - Stacking: progressive scale/rotation/offset
- Each card shows:
  - Experience: position, company, location, dates, bullet points
  - Project: name, subtitle, duration, bullet points, technologies
- **Dismiss button** on each card
- **Stack counter** showing how many cards are stacked

#### 2. `useCardStack.ts` Hook
- Manages stacked card state
- Maps milestones to experiences/projects via `milestoneMap`
- Prevents duplicate cards from stacking
- Provides `dismissCard` and `clearAllCards` functions
- `triggerCardFromMilestone` function to add cards programmatically

#### 3. Updated `Dashboard.tsx`
- Integrated `CardStack` component
- Connected chart click events to card triggering
- Repositioned **About Me** section:
  - Mobile: Right under chart (before Buying Power)
  - Desktop: Remains in right sidebar
- Created milestone mapping:
  ```typescript
  'Bender Trust Project' → Project #6
  'OroGenie Project' → Project #2
  'Kaktus Internship' → Experience #3
  // ... etc
  ```

### Data Updates
- Added **Bender Trust project** to `mockData.ts` (previously only existed as a chart milestone)

## Animation Details

### Card Stack Effect
- **Offset**: 12px per card (creates layered look)
- **Scale**: -2% per card (cards get slightly smaller as they stack)
- **Rotation**: 0.5° per card (very subtle tilt)
- **Z-index**: Reverse order (top card has highest z-index)

### Transitions
- **Spring animation** for smooth, natural feel
- **Stagger delay**: 50ms per card for sequential appearance
- **Exit animation**: Slide to right + fade out (200ms)

## Key Design Decisions

### Why This Pattern?
1. **Mobile space constraint**: Limited screen real estate needs creative solutions
2. **Visual storytelling**: Connects abstract chart points to concrete achievements
3. **Engagement**: Interactive discovery keeps users engaged
4. **Context preservation**: Cards overlay without hiding content underneath
5. **Guided narrative**: Chart becomes a tour through professional journey

### Why Clones?
- Original cards remain in their sections (scroll down to see full details)
- Stacked cards are **preview clones** triggered by chart interaction
- Reinforces connection: "This dot on the chart = this actual achievement"
- Users can dismiss clones to clean up view while still seeing full content below

## Future Enhancements (Optional)

### Scroll-Based Auto-Triggering
Currently cards only trigger on click. Could add:
- **Intersection Observer** to auto-trigger as chart milestones enter viewport
- Progressive stacking as user scrolls through chart
- Would create more of the "scroll-stack" effect from React Bits

### Gesture Improvements
- **Swipe to dismiss** (left/right swipe)
- **Tap card to expand** to full view
- **Drag to reorder** cards in stack

### Visual Polish
- **Blur effect** on cards deeper in stack (depth perception)
- **Shadow intensity** increases with stack position
- **Pulse animation** when new card is added
- **Haptic feedback** on mobile devices

## Testing Notes

### To Test
1. Open on mobile device or resize browser to mobile width
2. Click/tap any milestone dot on the chart (the larger dots with labels)
3. Watch card animate and stack over About Me section
4. Click multiple milestones to see stacking effect
5. Dismiss cards using X button
6. Verify desktop layout remains unchanged

### Known Limitations
- Cards currently only trigger on **manual click** (not scroll-based)
- Stack can grow indefinitely (no max limit set)
- No persistence (cards clear on page refresh)

## Files Modified/Created

### Created
- `src/components/CardStack.tsx` - Main card stack component
- `src/hooks/useCardStack.ts` - Card stack state management hook
- `CARD_STACK_FEATURE.md` - This documentation

### Modified
- `src/pages/Dashboard.tsx` - Integrated card stack, repositioned About Me
- `src/data/mockData.ts` - Added Bender Trust project

## Dependencies Used
- **framer-motion** - Already installed, used for animations
- **lucide-react** - Already installed, used for icons (X, MapPin, Calendar)

---

**Status**: ✅ Implemented and ready for testing
**Mobile Demo**: http://localhost:5175 (resize to mobile width)
