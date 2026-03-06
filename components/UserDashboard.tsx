import {
  CategoryProgress,
  PerformanceOverview,
  RecentScores,
  SummaryCards,
  Button
} from "@/lib/client-imports"
import { AverageScore, BestCategory, StudyTime, StartQuiz, TotalTests } from '@/lib/icons';
import { createClient } from "@/lib/supabase/server"

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

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

  //for best category, by grouping results by category and find the one with highest average score
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

  //for categoru progress
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

 // for performance overview
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

  //for recent scores, limited to 10
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

  //for summary cards data
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
    <div className="m-4 md:m-6 lg:m-8 gap-4 md:gap-6 lg:gap-8 flex flex-col">

      <div className="">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          Welcome Back {name}!
        </h1>
        <p className="text-xs md:text-sm lg:text-base text-foreground/70">
          Here is your learning progress and recent quiz scores
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <SummaryCards cards={summaryCards} />

      {/* START QUIZ BUTTON */}
      <a href="/customize-quiz">
        <Button
          text="Start a New Review"
          backgroundColor="bg-linear-to-r from-primary to-secondary"
          textColor="text-white"
          leftIcon={<StartQuiz />}
        />
      </a>

      {/* CATEGORY + PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <CategoryProgress categories={categoryProgress} />

        <PerformanceOverview
          overallScore={overallScore}
          overallScoreSub={String(totalTests)}
          bestScore={bestScore}
          lowestScore={lowestScore}
        />
      </div>

      {/* RECENT SCORES */}
      <RecentScores scores={recentScores} />

    </div>
  )
}

export default UserDashboard