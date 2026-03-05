import { HeroSection, HowItWorks, ComprehensiveCoverage, WhyChoose } from "@/lib/client-imports";

const Homepage = () => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 overflow-hidden">
      <HeroSection />
      <WhyChoose />
      <ComprehensiveCoverage />
      <HowItWorks />
    </div>
  )
}

export default Homepage