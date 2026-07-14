import { HeroSection, HowItWorks, ComprehensiveCoverage, WhyChoose, Contact } from "@/lib/client-imports";
import BoostPreparation from "./ui/BoostPreparation";
import ComingSoon from "./ui/ComingSoon";
import LatestArticles from "./ui/LatestArticles";

const Homepage = () => {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <WhyChoose />
      <ComprehensiveCoverage />
      <HowItWorks />
      <BoostPreparation />
      <ComingSoon />
      <LatestArticles />
      <Contact />
    </div>
  )
}

export default Homepage
