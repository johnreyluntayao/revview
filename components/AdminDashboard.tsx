import { Card, RecentTestsInfinite } from "@/lib/client-imports";
import { Verbal, AverageScore, TotalTests } from "@/lib/icons";
import { createClient as createServerClient } from "@/lib/supabase/server";

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

export default async function AdminDashboard() {
  const supabase = await createServerClient();

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

  // Stats fetching (unchanged)
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_admin", false);

  const { data: activeUsersData } = await supabase.rpc("get_active_users_last_30_days");
  const activeUsers = activeUsersData ?? 0;

  const { count: totalQuizzes } = await supabase
    .from("quiz_results")
    .select("*", { count: "exact", head: true });

  const { data: avgData } = await supabase.from("quiz_results").select("percentage");
  const avgScore =
    avgData && avgData.length > 0
      ? (avgData.reduce((sum, r) => sum + (r.percentage || 0), 0) / avgData.length).toFixed(1) + "%"
      : "—";

  const { data: recentResultsRaw } = await supabase
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
    .order("date_taken", { ascending: false });

  let initialTests: any[] = [];

  if (recentResultsRaw?.length) {
    const userIds = [...new Set(recentResultsRaw.map((r: any) => r.user_id))];

    const { data: usersData } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);

    const userMap = new Map(usersData?.map((u: any) => [u.id, u.name]) || []);

    initialTests = recentResultsRaw.map((r: any) => {
      const categoryName = r.categories?.name || (r.category_id ? "Unknown Category" : "All Categories");
      return {
        id: r.id,
        userName: userMap.get(r.user_id) || "Unknown User",
        category: categoryName,
        percentage: r.percentage || 0,
        totalQuestions: r.total_questions || 0,
        timestamp: new Intl.DateTimeFormat("en-US", {
          month: "long", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit", hour12: true,
        }).format(new Date(r.date_taken)).replace(", ", ", "),
      };
    });
  }

  return (
    <main className="px-4 md:px-6 lg:px-8 py-20 md:py-24 lg:py-28 space-y-4 md:space-y-6 lg:space-y-8 bg-primary/3 min-h-screen">
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          Welcome Back, {adminName}!
        </h1>
        <p className="text-xs md:text-sm lg:text-base font-medium text-muted-foreground mt-0.5">
          Here's the overview of your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mt-4 md:mt-5 lg:mt-6">
        <StatCard title="Total Users" value={totalUsers ?? 0} subValue="Registered Accounts" icon={<Verbal />} iconColor="text-primary" />
        <StatCard title="Active Users" value={activeUsers} subValue="Last 30 Days" icon={<Verbal />} iconColor="text-success" />
        <StatCard title="Quizzes Taken" value={totalQuizzes ?? 0} subValue="Total Attempts" icon={<AverageScore />} iconColor="text-secondary" />
        <StatCard title="Avg Score" value={avgScore} subValue="Across All Users" icon={<TotalTests />} iconColor="text-warning" />
      </div>

      <div className="rounded-xl border border-border p-4 md:p-6 lg:p-8 bg-card">
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-5 flex items-center gap-2">
          <div className="bg-linear-to-r from-primary/15 to-secondary/15 p-1 md:p-1.5 lg:p-2 rounded-md">
            <AverageScore className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-primary" />
          </div>
          Recent Tests Taken
        </h3>

        {initialTests.length === 0 ? (
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground">No recent quiz taken yet.</p>
        ) : (
          <RecentTestsInfinite initialTests={initialTests} />
        )}
      </div>
    </main>
  );
}