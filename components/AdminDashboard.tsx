import { Card, Chip } from "@/lib/client-imports";
import { Verbal, AverageScore, TotalTests, Calendar } from "@/lib/icons";
import { createClient } from "@/lib/supabase/server";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: React.ReactNode;
  iconColor: string;
}

const StatCard = ({ title, value, subValue, icon, iconColor }: StatCardProps) => (
  <Card
    variant="stat"
    title={title}
    value={value}
    subValue={subValue}
    icon={icon}
    iconColor="text-white"
    textColor="text-white"
  />
);

function formatTimestamp(date: string | Date): string {
  const d = new Date(date);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",       
    day: "numeric",      
    year: "numeric",    
    hour: "numeric",      
    minute: "2-digit", 
    hour12: true, 
  })
    .format(d)
    .replace(", ", ", "); 
}

const getCategoryVariant = (categoryName: string): string => {
  const name = categoryName?.toLowerCase() || "";

  if (name.includes("all") || name === "") {
    return "all";
  }
  if (name.includes("verbal")) {
    return "verbal";
  }
  if (name.includes("numerical")) {
    return "numerical";
  }
  if (name.includes("analytical")) {
    return "analytical";
  }
  if (name.includes("general") || name.includes("information")) {
    return "general";
  }

  return "default";
};

const getScoreTextColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-destructive";
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in again.</div>;
  }

  const { data: adminProfile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  const adminName = adminProfile?.name ?? "Admin";

  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_admin", false);

  const { data: activeUsersData } = await supabase
    .rpc("get_active_users_last_30_days");

  const activeUsers = activeUsersData ?? 0;

  const { count: totalQuizzes } = await supabase
    .from("quiz_results")
    .select("*", { count: "exact", head: true });

  const { data: avgData } = await supabase
    .from("quiz_results")
    .select("percentage");

  const avgScore =
    avgData && avgData.length > 0
      ? (avgData.reduce((sum, r) => sum + (r.percentage || 0), 0) / avgData.length).toFixed(1) + "%"
      : "—";

  const { data: recentResultsRaw, error: recentError } = await supabase
    .from("quiz_results")
    .select(`
      id,
      user_id,
      category_id,
      score,
      total_questions,
      date_taken,
      percentage,
      categories!left (name)
    `)
    .order("date_taken", { ascending: false })
    .limit(10);

  if (recentError) {
    console.error("Error fetching recent results:", recentError);
  }

  let recentTests: any[] = [];

  if (recentResultsRaw && recentResultsRaw.length > 0) {
    const userIds = [...new Set(recentResultsRaw.map((r: any) => r.user_id))];

    const { data: usersData } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);

    const userMap = new Map(usersData?.map((u: any) => [u.id, u.name]) || []);

    recentTests = recentResultsRaw.map((r: any) => {
      const categoryName = r.categories?.name || (r.category_id ? "Unknown Category" : "All Categories");

      return {
        id: r.id,
        userName: userMap.get(r.user_id) || "Unknown User",
        category: categoryName,
        categoryVariant: getCategoryVariant(categoryName),
        score: Math.round(r.score || 0),
        percentage: r.percentage,
        totalQuestions: r.total_questions || 0,
        timestamp: formatTimestamp(r.date_taken),
      };
    });
  }

  return (
    <main className="px-4 md:px-6 lg:px-8 py-20 lg:py-24 space-y-4 md:space-y-6 lg:space-y-8 bg-linear-to-br from-primary/5 to-secondary/5 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          Welcome Back, {adminName}!
        </h1>
        <p className="text-sm md:text-base font-medium lg:text-lg text-muted-foreground mt-0.5">
          Here's the overview of your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6 mt-6">
        <StatCard 
          title="Total Users" 
          value={totalUsers ?? 0} 
          subValue="Registered Accounts" 
          icon={<Verbal />} 
          iconColor="text-primary"
        />
        <StatCard 
          title="Active Users" 
          value={activeUsers} 
          subValue="Last 30 Days" 
          icon={<Verbal />} 
          iconColor="text-success" 
        />
        <StatCard 
          title="Quizzes Taken" 
          value={totalQuizzes ?? 0} 
          subValue="Total Attempts" 
          icon={<AverageScore />} 
          iconColor="text-secondary" 
        />
        <StatCard 
          title="Avg Score" 
          value={avgScore} 
          subValue="Across All Users" 
          icon={<TotalTests />} 
          iconColor="text-warning" 
        />
      </div>

      <div className="rounded-xl border border-border p-4 md:p-6 lg:p-8 bg-card">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <TotalTests className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          Recent Tests Taken
        </h3>

        {recentTests.length === 0 ? (
          <p className="text-muted-foreground">No recent quiz taken yet.</p>
        ) : (
          <div className="space-y-3">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between shadow-sm p-2 md:p-3 lg:p-4 rounded-lg hover:bg-primary/5 transition border border-transparent hover:border-primary/15 hover:shadow-none"
              >
                <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
                  <p className="text-sm md:text-base lg:text-lg font-semibold text-foreground/70">{test.userName}</p>
                  
                  <Chip 
                    variant={test.categoryVariant} 
                    text={test.category} 
                  />
                  <p className="flex items-center justify-center gap-1 md:gap-1.5 lg:gap-2 text-muted-foreground text-xs md:text-sm lg:text-base"><Calendar className="text-success w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 hidden md:block"/>{ test.timestamp}</p>
                </div>
                <div className="text-right w-full md:w-auto">
                  <p className={`text-lg md:text-xl lg:text-2xl font-bold ${getScoreTextColor(test.percentage)}`}>
                    {test.percentage}%
                  </p>
                  <p className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
                    {test.totalQuestions} questions
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}