interface HeroContentProps {
  title: string
  subtitle: string
}

export const HeroContent = ({ title, subtitle }: HeroContentProps) => (
  <div className="mb-6 text-center">
    <h1 className="text-balance text-4xl font-bold sm:text-5xl lg:text-6xl text-[#4D21FF]">
      {title}
    </h1>
    <p className="mx-auto mt-4 max-w-2xl text-lg text-[#21D4FF]">
      {subtitle}
    </p>
  </div>
)

