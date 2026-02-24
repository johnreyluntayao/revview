import { Card } from "@/lib/imports";
import { Verbal, AverageScore, TotalTests } from "@/lib/icons"

interface AdminDashboardProps {
  admin: string;
}



const AdminDashboard = ({ admin }: AdminDashboardProps) => {
    const recentTests = [
    {
      id: 1,
      userName: "John Doe",
      category: "Numerical Ability",
      score: 90,
      totalQuestions: 20,
      timestamp: "Feb 5, 2024 - 2:30 PM",
    },
    {
      id: 2,
      userName: "Jane Smith",
      category: "Analytical Ability",
      score: 85,
      totalQuestions: 20,
      timestamp: "Feb 5, 2024 - 1:45 PM",
    },
    {
      id: 3,
      userName: "Mike Johnson",
      category: "Verbal Ability",
      score: 78,
      totalQuestions: 25,
      timestamp: "Feb 5, 2024 - 11:20 AM",
    },
    {
      id: 4,
      userName: "Sarah Williams",
      category: "General Information",
      score: 88,
      totalQuestions: 20,
      timestamp: "Feb 4, 2024 - 3:15 PM",
    },
    {
      id: 5,
      userName: "Robert Brown",
      category: "All Categories",
      score: 82,
      totalQuestions: 50,
      timestamp: "Feb 4, 2024 - 10:00 AM",
    }]


  return (
    <main className="mx-4 md:mx-8 lg:mx-16 py-10">
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>Welcome Back, {admin}!</h1>
        <p className="text-sm md:text-base font-medium lg:text-lg text-muted-foreground mt-1 md:mt-2 lg:mt-3">Here's the overview of your dashboard.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6 mt-4 md:mt-6 lg:mt-8">
            <Card variant="stat" title="Total Users" value={1248} subValue="Registered Accounts" icon={<Verbal/>} iconColor="text-primary" textColor="text-foreground"/>
            <Card variant="stat" title="Active Users" value={652} subValue="Last 30 Days" icon={<Verbal/>} iconColor="text-success" textColor="text-foreground"/>
            <Card variant="stat" title="Quizzes Taken" value={5830} subValue="Total Attempts" icon={<AverageScore/>} iconColor="text-secondary" textColor="text-foreground"/>
            <Card variant="stat" title="Avg Score" value="75.2%" subValue="Across All Users" icon={<TotalTests/>} iconColor="text-warning" textColor="text-foreground"/>
        </div>

        <div className="rounded-xl border border-border p-4 md:p-6 lg:p-8 mt-4 md:mt-6 lg:mt-8">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <TotalTests className="w-5 h-5" />
                Recent Tests Taken
              </h3>
              <div className="space-y-3">
                {recentTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/5 transition border border-transparent hover:border-primary/15"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{test.userName}</p>
                      <p className="text-sm text-muted-foreground">{test.category}</p>
                      <p className="text-xs text-muted-foreground mt-1">{test.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{test.score}%</p>
                        <p className="text-xs text-muted-foreground">
                          {test.totalQuestions} questions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    </main>
  )
}

export default AdminDashboard