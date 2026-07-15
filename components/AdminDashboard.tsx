import Link from "next/link";
import { RecentTestsInfinite } from "@/lib/client-imports";
import {
  Affiliate,
  ArrowRight,
  AverageScore,
  Blog,
  Feedback,
  Questions,
  Sparkles,
  TotalTests,
  Verbal,
} from "@/lib/icons";
import { createClient as createServerClient } from "@/lib/supabase/server";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: React.ReactNode;
  accent: string;
}

interface QuizResultRow {
  id: string;
  user_id: string;
  category_id: string | null;
  total_questions: number | null;
  date_taken: string;
  percentage: number | null;
  categories: { name: string } | { name: string }[] | null;
}

interface RecentTestItem {
  id: string;
  userName: string;
  category: string;
  percentage: number;
  totalQuestions: number;
  timestamp: string;
}

const getCategoryName = (result: QuizResultRow) => {
  const category = Array.isArray(result.categories)
    ? result.categories[0]
    : result.categories;

  return category?.name || (result.category_id ? "Unknown Category" : "All Categories");
};

const StatCard = ({ title, value, subValue, icon, accent }: StatCardProps) => (
  <article className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md md:p-5">
    <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground md:text-sm">{title}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{subValue}</p>
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground md:size-11 [&>svg]:size-5">
        {icon}
      </div>
    </div>
  </article>
);

const quickActions = [
  {
    label: "Manage questions",
    description: "Review and maintain the question bank",
    href: "/manage-questions",
    icon: Questions,
  },
  {
    label: "Manage blogs",
    description: "Create and publish learning content",
    href: "/manage-blogs",
    icon: Blog,
  },
  {
    label: "Review feedback",
    description: "See what learners are reporting",
    href: "/feedbacks",
    icon: Feedback,
  },
  {
    label: "Affiliate products",
    description: "Update product recommendations",
    href: "/affiliate",
    icon: Affiliate,
  },
];

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
    .order("date_taken", { ascending: false })
    .range(0, 9);

  let initialTests: RecentTestItem[] = [];

  if (recentResultsRaw?.length) {
    const recentResults = recentResultsRaw as unknown as QuizResultRow[];
    const userIds = [...new Set(recentResults.map((result) => result.user_id))];

    const { data: usersData } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);

    const userMap = new Map(
      (usersData ?? []).map((profile) => [profile.id, profile.name] as const),
    );

    initialTests = recentResults.map((result) => {
      return {
        id: result.id,
        userName: userMap.get(result.user_id) || "Unknown User",
        category: getCategoryName(result),
        percentage: result.percentage || 0,
        totalQuestions: result.total_questions || 0,
        timestamp: new Intl.DateTimeFormat("en-US", {
          month: "long", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit", hour12: true,
        }).format(new Date(result.date_taken)).replace(", ", ", "),
      };
    });
  }

  return (
    <main className="min-h-screen bg-primary/[0.025] px-4 pb-10 pt-20 md:px-6 md:pb-12 md:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto max-w-screen-2xl space-y-5 md:space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-card px-5 py-6 shadow-sm md:px-7 md:py-7">
          <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-24 size-48 rounded-full bg-secondary/8 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                Admin workspace
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Welcome back, {adminName}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Monitor learner activity and manage RevView from one place.
              </p>
            </div>
            <p className="w-fit rounded-lg border border-border bg-background/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-xs">
              Overview · Last 30 days
            </p>
          </div>
        </section>

        <section aria-labelledby="dashboard-overview-title">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 id="dashboard-overview-title" className="text-base font-semibold text-foreground md:text-lg">
                Platform overview
              </h2>
              <p className="text-xs text-muted-foreground md:text-sm">Key activity across RevView</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total users" value={totalUsers ?? 0} subValue="Registered learner accounts" icon={<Verbal />} accent="bg-primary" />
            <StatCard title="Active users" value={activeUsers} subValue="Active during the last 30 days" icon={<Verbal />} accent="bg-success" />
            <StatCard title="Quizzes taken" value={totalQuizzes ?? 0} subValue="Completed quiz attempts" icon={<TotalTests />} accent="bg-secondary" />
            <StatCard title="Average score" value={avgScore} subValue="Across all completed quizzes" icon={<AverageScore />} accent="bg-warning" />
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-4 md:px-6 md:py-5">
              <div>
                <h2 className="text-base font-semibold text-foreground md:text-lg">Recent quiz activity</h2>
                <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Latest learner attempts and results</p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <AverageScore className="size-4.5" />
              </div>
            </div>

            <div className="p-3 md:p-4">
              {initialTests.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 text-center">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <TotalTests className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No quiz activity yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Completed learner quizzes will appear here.</p>
                </div>
              ) : (
                <RecentTestsInfinite initialTests={initialTests} />
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground md:text-lg">Quick actions</h2>
              <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Common administration tasks</p>
            </div>

            <nav aria-label="Quick admin actions" className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-primary/15 hover:bg-primary/5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                    <action.icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{action.label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
