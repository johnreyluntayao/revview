import { HeroSection, HowItWorks, ComprehensiveCoverage, Contact, Footer } from "@/lib/imports";

const Homepage = () => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 overflow-hidden">
      <HeroSection />
      <ComprehensiveCoverage />
      <HowItWorks />
    </div>
  )
}

export default Homepage