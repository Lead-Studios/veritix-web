import { ReactNode } from 'react'

interface ScrollColumnProps {
  animationClass: string
  children: ReactNode
  className?: string
}

export const ScrollColumn = ({ animationClass, children, className = '' }: ScrollColumnProps) => (
  <div className="relative h-full overflow-hidden rounded-lg">
    <div
      className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b"
      style={{ backgroundImage: 'linear-gradient(to bottom, #101428, transparent, #101428)' }}
    />
    <div className={`${animationClass} flex flex-col ${className}`}>
      {children}
    </div>
  </div>
)

