import CustomizeMain from "@/components/CustomizeMain";
import Colors from "@/components/samples/Colors";
import { IconGallery } from "@/components/samples/Icons";
import CategoryProgress from "@/components/ui/CategoryProgress";
import ComprehensiveCoverage from "@/components/ui/ComprehensiveCoverage";
import Contact from "@/components/ui/Contact";
import HeroSection from "@/components/ui/HeroSection";
import HowItWorks from "@/components/ui/HowItWorks";
import PerformanceOverview from "@/components/ui/PerformanceOverview";
import RecentScores from "@/components/ui/RecentScores";
import SelectDifficultyLevel from "@/components/ui/SelectDifficultyLevel";
import SelectNumQuestions from "@/components/ui/SelectNumQuestions";
import SummaryCards from "@/components/ui/SummaryCards";
import WhyChoose from "@/components/ui/WhyChoose";
import UserDashboard from "@/components/UserDashboard";

export default function Home() {


  return (
    <div className="w-full">
      <CustomizeMain/>
      <Colors/>
      <IconGallery/>
      <WhyChoose/>
    </div>
  );
}
