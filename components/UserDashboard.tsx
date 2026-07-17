import {
  CategoryProgress,
  PerformanceOverview,
  RecentScores,
  SummaryCards,
} from "@/lib/client-imports";
import Link from "next/link";
import {
  ArrowRight,
  AverageScore,
  BestCategory,
  Sparkles,
  StartQuiz,
  StudyTime,
  TotalTests,
} from "@/lib/icons";
import { createClient } from "@/lib/supabase/server";

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}hr & ${m}min`;
  } else if (m > 0) {
    return `${m}min & ${s}secs`;
  } else {
    return `${s}secs`;
  }
};

const formatDate = (date: string) => {
  const d = new Date(date)
  return d
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
    .replace(",", "")
}

const UserDashboard = async () => {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return null

  //for fetching username
  const { data: userProfile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single()

  const name = userProfile?.name ?? "User"

  //for fetching quiz results
  const { data: results } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", user.id)

  const quizResults = results ?? []

  //summarize data
  const totalTests = quizResults.length

  const averageScore =
    totalTests > 0
      ? (
          quizResults.reduce((a, b) => a + Number(b.percentage), 0) / totalTests
        ).toFixed(2) + "%"
      : "0%"

  const totalTimeSeconds = quizResults.reduce(
    (acc, r) => acc + r.time_taken_seconds,
    0
  )

  const studyTime = formatTime(totalTimeSeconds)

  //for best category
  const categoryGroups: Record<string, number[]> = {}

  quizResults.forEach((r) => {
    if (!r.category_id) return
    if (!categoryGroups[r.category_id]) categoryGroups[r.category_id] = []
    categoryGroups[r.category_id].push(Number(r.percentage))
  })

  let bestCategoryId: string | null = null
  let bestAverage = 0

  Object.entries(categoryGroups).forEach(([id, values]) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    if (avg > bestAverage) {
      bestAverage = avg
      bestCategoryId = id
    }
  })

  let bestCategory = "N/A"

  if (bestCategoryId) {
    const { data } = await supabase
      .from("categories")
      .select("name")
      .eq("id", bestCategoryId)
      .single()

    bestCategory = data?.name ?? "N/A"
  }

  //for category progress
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")

  const categoryProgress = [
    "Numerical Ability",
    "Analytical Ability",
    "Verbal Ability",
    "General Information"
  ].map((catName) => {
    const category = categories?.find((c) => c.name === catName)

    const filtered = quizResults.filter((r) => r.category_id === category?.id)

    const count = filtered.length

    const avg =
      count > 0
        ? filtered.reduce((a, b) => a + Number(b.percentage), 0) / count
        : 0

    return {
      title: catName,
      value: Number(avg.toFixed(2)),
      testCount: count
    }
  })

  const allCategoryResults = quizResults.filter((r) => r.category_id === null)

  const allCount = allCategoryResults.length

  const allAvg =
    allCount > 0
      ? allCategoryResults.reduce((a, b) => a + Number(b.percentage), 0) /
        allCount
      : 0

  categoryProgress.push({
    title: "All Categories",
    value: Number(allAvg.toFixed(2)),
    testCount: allCount
  })

  // PERFORMANCE OVERVIEW
  const percentages = quizResults.map((r) => Number(r.percentage))

  const overallScore =
    percentages.length > 0
      ? (
          percentages.reduce((a, b) => a + b, 0) / percentages.length
        ).toFixed(2) + "%"
      : "0%"

  const bestScore =
    percentages.length > 0 ? Math.max(...percentages).toFixed(2) + "%" : "0%"

  const lowestScore =
    percentages.length > 0 ? Math.min(...percentages).toFixed(2) + "%" : "0%"

  // ✅ NEW: SCORE IMPROVEMENT
  let scoreImprovement = "0%"

  if (quizResults.length >= 2) {
    const sorted = [...quizResults].sort(
      (a, b) => new Date(b.date_taken).getTime() - new Date(a.date_taken).getTime()
    )

    const latest = Number(sorted[0].percentage)
    const previous = Number(sorted[1].percentage)

    const diff = latest - previous

    scoreImprovement =
      (diff > 0 ? "+" : "") + diff.toFixed(2) + "%"
  }

  // RECENT SCORES
  const { data: recentResults } = await supabase
    .from("quiz_results")
    .select(`
      id,
      score,
      total_questions,
      difficulty_id,
      category_id,
      time_taken_seconds,
      date_taken
    `)
    .eq("user_id", user.id)
    .order("date_taken", { ascending: false })
    .limit(10)

  const difficultyIds =
    recentResults?.map((r) => r.difficulty_id) ?? []

  const categoryIds =
    recentResults?.map((r) => r.category_id).filter(Boolean) ?? []

  const { data: difficulties } = await supabase
    .from("difficulty_levels")
    .select("id,label")
    .in("id", difficultyIds)

  const { data: categoryNames } = await supabase
    .from("categories")
    .select("id,name")
    .in("id", categoryIds)

  const recentScores =
    recentResults?.map((r) => ({
      key: r.id,
      category:
        r.category_id === null
          ? "All Categories"
          : categoryNames?.find((c) => c.id === r.category_id)?.name ?? "",
      score: `${r.score}/${r.total_questions}`,
      difficulty:
        difficulties?.find((d) => d.id === r.difficulty_id)?.label ?? "Easy",
      time: formatTime(r.time_taken_seconds),
      date: formatDate(r.date_taken)
    })) ?? []

  // SUMMARY CARDS
  const summaryCards = [
    {
      icon: <TotalTests />,
      title: "Total Tests",
      value: totalTests
    },
    {
      icon: <AverageScore />,
      title: "Average Score",
      value: averageScore
    },
    {
      icon: <BestCategory />,
      title: "Best Category",
      value: bestCategory
    },
    {
      icon: <StudyTime />,
      title: "Study Time",
      value: studyTime
    }
  ]

  return (
    <main className="min-h-screen bg-primary/[0.025] px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 md:gap-6">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-card px-5 py-6 shadow-sm md:px-7 md:py-7">
          <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-24 size-48 rounded-full bg-secondary/8 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                Learning overview
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Welcome back, {name}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Keep building momentum with another focused review session.
              </p>
            </div>
            <Link
              href="/quiz-selection"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:w-auto"
            >
              <StartQuiz className="size-4" />
              Start a review
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <SummaryCards cards={summaryCards} />

        <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
          <CategoryProgress categories={categoryProgress} />

          <PerformanceOverview
            overallScore={overallScore}
            overallScoreSub={String(totalTests)}
            bestScore={bestScore}
            lowestScore={lowestScore}
            scoreImprovement={scoreImprovement}
          />
        </div>

        <RecentScores scores={recentScores} />
      </div>
    </main>
  );
};

export default UserDashboard;
