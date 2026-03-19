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

const CustomizeQuiz = () => {
  const supabase = createClient();

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
      if (diffData) {
        const mapped = diffData.map((d) => ({
          ...d
        }));
        setDifficultyLevels(mapped);
      }
    };

    fetchData();
  }, []);

const selectedDifficultyObj = difficultyLevels.find(
  (d) => String(d.id) === String(selectedDifficulty)
);

const totalTime =
  selectedDifficultyObj && selectedQuestions
    ? (Number(selectedDifficultyObj.minutes_per_question) || 0) *
      Number(selectedQuestions)
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

      const { error } = await supabase.from("quiz_sessions").insert({
        user_id: user.id,
        category_id: selectedCategory,
        difficulty_id: selectedDifficulty,
        total_questions: selectedQuestions,
        total_time_seconds: Number(totalTime) * 60,
      });

      if (error) throw error;

      toast.success("Quiz session created!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="mx-4 md:mx-6 lg:mx-8 py-10 gap-4 md:gap-6 lg:gap-8 flex flex-col">
      <div className="text-center">
        <h1 className="text-lg md:text-2xl lg:text-4xl font-bold text-foreground mb-1 md:mb-1.5 lg:mb-2">
          Customize your Review
        </h1>
        <p className="text-xs md:text-base lg:text-lg text-foreground/60">
          Choose your category, number of questions, and difficulty to start your personalized quiz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 md:gap-6 lg:gap-8">
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
            selectedDifficulty={
              selectedDifficultyObj?.label || ""
            }
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