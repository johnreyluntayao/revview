import { StartQuiz } from "@/lib/icons"
import Button from "./atoms/Button"
import CategoryProgress from "./ui/CategoryProgress"
import PerformanceOverview from "./ui/PerformanceOverview"
import RecentScores from "./ui/RecentScores"
import SummaryCards from "./ui/SummaryCards"


const UserDashboard = () => {
  return (
    <div className="mx-4 md:mx-8 lg:mx-16 py-10 gap-4 md:gap-5 lg:gap-6 flex flex-col">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
        Welcome Back Johnrey!
      </h1>
      <p className="text-sm md:text-base lg:text-lg text-foreground/70">Here is your learning progress and recent quiz scores</p>

      <SummaryCards/>
      <Button text="Start a New Review" backgroundColor="bg-linear-to-r from-primary to-secondary" textColor="text-white" className="w-62.5 h-13.75" leftIcon={<StartQuiz/>}/>
      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:gap-6 "> 
        <CategoryProgress/>
        <PerformanceOverview/>
      </div>
      <RecentScores/>
    </div>
  )
}

export default UserDashboard