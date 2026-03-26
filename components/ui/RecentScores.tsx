import { Chip } from '@/lib/client-imports'
import { ChipProps } from '@/lib/types'
import React from 'react'

interface ScoreEntry {
  key: string
  category: string
  score: string
  difficulty: string
  time: string
  date: string
}

interface RecentScoresProps {
  scores: ScoreEntry[]
}

const RecentScores = ({ scores }: RecentScoresProps) => {

  const getDifficultyVariant = (difficulty: string | undefined): ChipProps['variant'] => {
    if (!difficulty) return "default";

    const diff = difficulty.toLowerCase().trim();

    switch (diff) {
      case "easy":
        return "easy"; 
      case "medium":
        return "medium";  
      case "hard":
        return "hard"; 
      default:
        return "default";   
    }
  };

  return (
    <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-4 md:p-5 lg:p-6 rounded-xl border-border border overflow-hidden">

      {/* Header */}
      <div className="mb-2 md:mb-4 lg:mb-6">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
          Recent Scores
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-2 md:mx-0">
        <table className="w-full min-w-auto text-xs md:text-sm lg:text-base">
          <thead>
            <tr className="border-border text-foreground">
              <th className="px-4 py-3.5 text-left font-medium">Category</th>
              <th className="px-3 py-3.5 text-center font-medium">Score</th>
              <th className="px-3 py-3.5 text-center font-medium hidden md:table-cell">Difficulty</th>
              <th className="px-3 py-3.5 text-center font-medium hidden lg:table-cell">Total Time Taken</th>
              <th className="px-4 py-3.5 text-right font-medium hidden lg:table-cell">Date & Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {scores.map((score) => (
              <tr key={score.key}>
                <td className="px-4 py-4 whitespace-nowrap">
                  {score.category}
                </td>

                <td className="px-3 py-4 text-center font-medium">
                  <Chip
                    text={score.score}
                    variant='score'
                  />
                </td>

                <td className="px-3 py-4 text-center hidden md:table-cell">
                  <Chip
                    text={score.difficulty}
                    variant={getDifficultyVariant(score.difficulty)}
                  />
                </td>

                <td className="px-3 py-4 text-center text-muted-foreground hidden lg:table-cell">
                  {score.time}
                </td>

                <td className="px-4 py-4 text-right text-muted-foreground hidden lg:table-cell">
                  {score.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentScores