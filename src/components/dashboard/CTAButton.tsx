import Link from 'next/link'

interface CTAButtonProps {
  href: string
  text: string
  variant?: 'primary' | 'secondary'
}

export const CTAButton = ({ href, text, variant = 'primary' }: CTAButtonProps) => {
  const className = variant === 'primary'
    ? "inline-flex items-center justify-center px-8 py-3 bg-[linear-gradient(135deg,#4D21FF_0%,#21D4FF_100%)] text-base font-semibold rounded-lg text-white transition-all hover:opacity-90 w-full sm:w-auto"
    : "inline-flex items-center justify-center px-8 py-3 text-base font-semibold rounded-lg border border-[#4D21FF] text-white hover:bg-white/5 bg-transparent transition-colors w-full sm:w-auto"
  
  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  )
}

