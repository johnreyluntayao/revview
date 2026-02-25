

import { ScoreCard } from "@/lib/imports";

export default function Home() {


  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <ScoreCard
        score={21}
        correctCount={31}
        totalQuestions={40}
        minutesUsed={12}
        secondsUsed={45}
      />

</div>
  );
}
