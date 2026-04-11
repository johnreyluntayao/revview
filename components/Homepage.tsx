import { HeroSection, HowItWorks, ComprehensiveCoverage, WhyChoose, Contact } from "@/lib/client-imports";
import BoostPreparation from "./ui/BoostPreparation";

const Homepage = () => {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <WhyChoose />
      <ComprehensiveCoverage />
      <HowItWorks />
      <BoostPreparation />
      <Contact />
    </div>
  )
}

export default Homepage