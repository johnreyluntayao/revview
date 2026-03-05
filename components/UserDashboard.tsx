import { StartQuiz } from "@/lib/icons"
import Button from "./atoms/Button"
import { CategoryProgress, PerformanceOverview, RecentScores, SummaryCards } from "@/lib/imports"



const UserDashboard = () => {
  return (
    <div className="m-4 md:m-6 lg:m-8 gap-4 md:gap-6 lg:gap-8 flex flex-col">
      <div className="pt-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
        Welcome Back Johnrey!
        </h1>
        <p className="text-xs md:text-sm lg:text-base text-foreground/70">Here is your learning progress and recent quiz scores</p>
      </div>
      
      <div>
        <SummaryCards/>
      </div>
      
      <div>
        <Button text="Start a New Review" backgroundColor="bg-linear-to-r from-primary to-secondary" textColor="text-white" leftIcon={<StartQuiz/>}/>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8"> 
        <CategoryProgress/>
        <PerformanceOverview/>
      </div>
      <div>
        <RecentScores/>
      </div>
      
    </div>
  )
}

export default UserDashboard