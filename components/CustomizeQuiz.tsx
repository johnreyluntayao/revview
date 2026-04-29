"use client";

import {
  SelectCategory,
  SelectDifficultyLevel,
  SelectNumQuestions,
  SummaryPanel,
} from "@/lib/client-imports";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { QuizCategory, DifficultyLevel } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AdsSection from "./ui/AdsSection";

const CustomizeQuiz = () => {
  const supabase = createClient();
  const router = useRouter();

  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase.from("categories").select("*");
      const { data: diffData } = await supabase.from("difficulty_levels").select("*");

      if (catData) setCategories(catData);
      if (diffData) setDifficultyLevels(diffData);
    };

    fetchData();
  }, []);

  const selectedDifficultyObj = difficultyLevels.find(
    (d) => String(d.id) === String(selectedDifficulty)
  );

  const totalTime =
    selectedDifficultyObj && selectedQuestions
      ? Number(selectedDifficultyObj.minutes_per_question) * selectedQuestions
      : 0;

  const handleStartQuiz = async () => {
    if (!selectedDifficulty || !selectedQuestions) {
      toast.error("Please complete all selections");
      return;
    }

    try {
      setIsStarting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // ✅ Use your SQL function (random + category-safe)
      const { data: randomQuestions, error: qError } = await supabase.rpc(
        "get_random_questions",
        {
          p_limit: selectedQuestions,
          p_category_id: selectedCategory,
        }
      );

      if (qError) throw qError;

      if (!randomQuestions || randomQuestions.length < selectedQuestions) {
        throw new Error("Not enough questions available.");
      }

      const questionIds = randomQuestions.map((q: any) => q.id);

      // ✅ Insert session
      const { data: newSession, error: insertError } = await supabase
        .from("quiz_sessions")
        .insert({
          user_id: user.id,
          category_id: selectedCategory,
          difficulty_id: selectedDifficulty,
          total_questions: selectedQuestions,
          total_time_seconds: totalTime * 60,
          question_ids: questionIds,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      if (!newSession) throw new Error("Failed to create session");

      toast.success("Quiz started!");

      // ✅ redirect AFTER insert
      router.push(`/quiz/${newSession.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to start quiz");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 flex flex-col bg-primary/3">
      <div className="text-center">
        <h1 className="text-lg md:text-2xl lg:text-4xl font-bold text-foreground mb-1 md:mb-1.5 lg:mb-2">
          Customize your Review
        </h1>
        <p className="text-xs md:text-base lg:text-lg text-muted-foreground">
          Choose your category, number of questions, and difficulty to start your personalized quiz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="col-span-2 flex flex-col gap-4 md:gap-6 lg:gap-8">
          <SelectCategory
            categories={categories}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />

          <SelectNumQuestions
            selected={selectedQuestions}
            setSelected={setSelectedQuestions}
          />

          <SelectDifficultyLevel
            difficultyLevels={difficultyLevels}
            selected={selectedDifficulty}
            setSelected={setSelectedDifficulty}
          />
        </div>

        <div className="col-span-1">
          <SummaryPanel
            categories={categories}
            selectedCategory={selectedCategory}
            selectedQuestions={selectedQuestions}
            selectedDifficulty={selectedDifficultyObj?.label || ""}
            totalTime={totalTime}
            isStarting={isStarting}
            handleStartQuiz={handleStartQuiz}
          />
          
        </div>
      </div>
    </div>
  );
};

export default CustomizeQuiz;