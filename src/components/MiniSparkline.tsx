interface MiniSparklineProps {
  trend: 'up' | 'down'
}

export default function MiniSparkline({ trend }: MiniSparklineProps) {
  const color = trend === 'up' ? '#00C805' : '#FF5000'
  
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="flex-shrink-0">
      {trend === 'up' ? (
        <path 
          d="M 0 20 Q 6 18 12 14 T 24 10 Q 30 8 36 6 T 48 2" 
          stroke={color} 
          strokeWidth="1.5" 
          fill="none"
        />
      ) : (
        <path 
          d="M 0 4 Q 6 6 12 10 T 24 14 Q 30 16 36 18 T 48 22" 
          stroke={color} 
          strokeWidth="1.5" 
          fill="none"
        />
      )}
    </svg>
  )
}
