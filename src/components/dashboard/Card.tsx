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
    <p className="text-xs uppercase text-brand-accent">{title}</p>
    {subtitle && <p className="text-xs text-brand-accent">{subtitle}</p>}
    {extraInfo && <div className="mt-4 text-sm font-semibold text-brand-primary">{extraInfo}</div>}
  </>
)

interface StatDisplayProps {
  label: string
  value: string
  detail: string
}

export const StatDisplay = ({ label, value, detail }: StatDisplayProps) => (
  <>
    <p className="text-xs text-brand-accent">{label}</p>
    <p className="text-lg font-bold text-brand-primary">{value}</p>
    <p className="text-xs text-brand-accent">{detail}</p>
  </>
)

