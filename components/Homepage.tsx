import { HeroSection, HowItWorks, ComprehensiveCoverage, WhyChoose } from "@/lib/client-imports";

const Homepage = () => {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <WhyChoose />
      <ComprehensiveCoverage />
      <HowItWorks />
    </div>
  )
}

export default Homepage