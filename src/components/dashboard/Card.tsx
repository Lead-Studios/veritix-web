import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`p-6 shrink-0 bg-[#000625] ${className}`}>
    {children}
  </div>
)

interface CardHeaderProps {
  title: string
  subtitle?: string
  extraInfo?: string
}

export const CardHeader = ({ title, subtitle, extraInfo }: CardHeaderProps) => (
  <>
    <p className="text-xs uppercase text-[#21D4FF]">{title}</p>
    {subtitle && <p className="text-xs text-[#21D4FF]">{subtitle}</p>}
    {extraInfo && <div className="mt-4 text-sm font-semibold text-[#4D21FF]">{extraInfo}</div>}
  </>
)

interface StatDisplayProps {
  label: string
  value: string
  detail: string
}

export const StatDisplay = ({ label, value, detail }: StatDisplayProps) => (
  <>
    <p className="text-xs text-[#21D4FF]">{label}</p>
    <p className="text-lg font-bold text-[#4D21FF]">{value}</p>
    <p className="text-xs text-[#21D4FF]">{detail}</p>
  </>
)

