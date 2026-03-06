import { Card } from "@/lib/client-imports";
import { Verbal, AverageScore, TotalTests } from "@/lib/icons";
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
    iconColor={iconColor}
    textColor="text-foreground"
  />
);

function formatTimestamp(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d).replace(/,/, " -");
}

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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: activeUsers } = await supabase
    .from("quiz_results")
    .select("*", { count: "exact", head: true })
    .gte("date_taken", thirtyDaysAgo.toISOString());

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

  const { data: recentResults } = await supabase
    .from("quiz_results")
    .select(`
      id,
      user_id,
      category_id,
      score,
      total_questions,
      date_taken,
      users!inner (name),
      categories!left (name)
    `)
    .order("date_taken", { ascending: false }) 
    .limit(10);

  const recentTests = (recentResults || []).map((r: any) => ({
    id: r.id,
    userName: r.users?.name || "Unknown User",
    category: r.categories?.name || (r.category_id ? "Unknown" : "All Categories"),
    score: Math.round(r.score),  
    totalQuestions: r.total_questions,
    timestamp: formatTimestamp(r.date_taken),
  }));

  return (
    <main className="mx-4 md:mx-8 lg:mx-16 py-10">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
        Welcome Back, {adminName}!
      </h1>
      <p className="text-sm md:text-base font-medium lg:text-lg text-muted-foreground mt-1 md:mt-2 lg:mt-3">
        Here's the overview of your dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6 mt-4 md:mt-6 lg:mt-8">
        <StatCard title="Total Users" value={totalUsers ?? 0} subValue="Registered Accounts" icon={<Verbal />} iconColor="text-primary" />
        <StatCard title="Active Users" value={activeUsers ?? 0} subValue="Last 30 Days" icon={<Verbal />} iconColor="text-success" />
        <StatCard title="Quizzes Taken" value={totalQuizzes ?? 0} subValue="Total Attempts" icon={<AverageScore />} iconColor="text-secondary" />
        <StatCard title="Avg Score" value={avgScore} subValue="Across All Users" icon={<TotalTests />} iconColor="text-warning" />
      </div>

      <div className="rounded-xl border border-border p-4 md:p-6 lg:p-8 mt-4 md:mt-6 lg:mt-8">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <TotalTests className="w-5 h-5" />
          Recent Tests Taken
        </h3>

        {recentTests.length === 0 ? (
          <p className="text-muted-foreground">No recent activity yet.</p>
        ) : (
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
        )}
      </div>
    </main>
  );
}