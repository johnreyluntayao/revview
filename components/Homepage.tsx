import { HeroSection, HowItWorks, ComprehensiveCoverage, WhyChoose, Contact } from "@/lib/client-imports";
import BoostPreparation from "./ui/BoostPreparation";
import ComingSoon from "./ui/ComingSoon";

const Homepage = () => {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <WhyChoose />
      <ComprehensiveCoverage />
      <HowItWorks />
      <BoostPreparation />
      <ComingSoon />
      <Contact />
    </div>
  )
}

export default Homepage