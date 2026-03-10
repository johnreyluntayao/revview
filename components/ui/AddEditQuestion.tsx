"use client";

import { useState, useEffect, useRef } from "react";
import { InputField, Button, ComboBox, InsertImage } from "@/lib/client-imports";
import { createClient } from "@/lib/supabase/client";

interface QuestionData {
  questionText?: string;
  questionImage?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string;
  optionAImage?: string;
  optionBImage?: string;
  optionCImage?: string;
  optionDImage?: string;
  optionEImage?: string;
  correctAnswer?: string;
  category?: string;
  explanationText?: string;
  explanationImage?: string;
}

interface AddEditQuestionProps {
  isOpen: boolean;
  isEdit?: boolean;
  initialData?: QuestionData;
  onSave?: (data: QuestionData) => void;
  onClose: () => void;
}

export default function AddEditQuestion({
  isOpen,
  isEdit = false,
  initialData = {},
  onSave,
  onClose,
}: AddEditQuestionProps) {

  const [questionText, setQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState("");

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [optionE, setOptionE] = useState("");

  const [optionAImage, setOptionAImage] = useState("");
  const [optionBImage, setOptionBImage] = useState("");
  const [optionCImage, setOptionCImage] = useState("");
  const [optionDImage, setOptionDImage] = useState("");
  const [optionEImage, setOptionEImage] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState("");
  const [category, setCategory] = useState("");

  const [explanationText, setExplanationText] = useState("");
  const [explanationImage, setExplanationImage] = useState("");

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const supabase = createClient();

  const modalRef = useRef<HTMLDivElement>(null);

  // Load categories
  useEffect(() => {
    if (!isOpen) return;

    async function loadCategories() {
      setLoadingCats(true);

      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (!error && data) {
        setCategories(data);
      }

      setLoadingCats(false);
    }

    loadCategories();
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuestionText(initialData.questionText || "");
      setQuestionImage(initialData.questionImage || "");

      setOptionA(initialData.optionA || "");
      setOptionB(initialData.optionB || "");
      setOptionC(initialData.optionC || "");
      setOptionD(initialData.optionD || "");
      setOptionE(initialData.optionE || "");

      setOptionAImage(initialData.optionAImage || "");
      setOptionBImage(initialData.optionBImage || "");
      setOptionCImage(initialData.optionCImage || "");
      setOptionDImage(initialData.optionDImage || "");
      setOptionEImage(initialData.optionEImage || "");

      setCorrectAnswer(initialData.correctAnswer || "");
      setCategory(initialData.category || "");

      setExplanationText(initialData.explanationText || "");
      setExplanationImage(initialData.explanationImage || "");
    }
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleSave = () => {
    if (!questionText.trim() || !correctAnswer || !category) {
      alert("Please fill in all required fields (*)");
      return;
    }

    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      alert("Options A–D are required");
      return;
    }

    const data: QuestionData = {
      questionText: questionText.trim() || undefined,
      questionImage: questionImage.trim() || undefined,

      optionA: optionA.trim() || undefined,
      optionB: optionB.trim() || undefined,
      optionC: optionC.trim() || undefined,
      optionD: optionD.trim() || undefined,
      optionE: optionE.trim() || undefined,

      optionAImage: optionAImage.trim() || undefined,
      optionBImage: optionBImage.trim() || undefined,
      optionCImage: optionCImage.trim() || undefined,
      optionDImage: optionDImage.trim() || undefined,
      optionEImage: optionEImage.trim() || undefined,

      correctAnswer,
      category,

      explanationText: explanationText.trim() || undefined,
      explanationImage: explanationImage.trim() || undefined,
    };

    onSave?.(data);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >

      <div
        className="
        flex flex-col w-full max-w-5xl max-h-[95vh] mx-4 md:mx-8
        bg-background rounded-xl border border-border
        shadow-2xl overflow-hidden
      "
      >

        <div className="px-6 pt-6 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Question" : "Add New Question"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Question */}
          <div className="space-y-5">
            <InputField
              label="Question Text *"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the full question here..."
            />

            <InsertImage
              label="Question Image (optional)"
              value={questionImage}
              onChange={setQuestionImage}
              folder="img_question"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Option A */}
              <div className="space-y-2">
                <InputField
                  label="Option A *"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                />
                <InsertImage
                  label="Option A Image"
                  value={optionAImage}
                  onChange={setOptionAImage}
                  folder="img_options"
                  variant="compact"
                />
              </div>

              {/* Option B */}
              <div className="space-y-2">
                <InputField
                  label="Option B *"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                />
                <InsertImage
                  label="Option B Image"
                  value={optionBImage}
                  onChange={setOptionBImage}
                  folder="img_options"
                  variant="compact"
                />
              </div>

              {/* Option C */}
              <div className="space-y-2">
                <InputField
                  label="Option C *"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                />
                <InsertImage
                  label="Option C Image"
                  value={optionCImage}
                  onChange={setOptionCImage}
                  folder="img_options"
                  variant="compact"
                />
              </div>

              {/* Option D */}
              <div className="space-y-2">
                <InputField
                  label="Option D *"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                />
                <InsertImage
                  label="Option D Image"
                  value={optionDImage}
                  onChange={setOptionDImage}
                  folder="img_options"
                  variant="compact"
                />
              </div>

              {/* Option E */}
              <div className="space-y-2">
                <InputField
                  label="Option E"
                  value={optionE}
                  onChange={(e) => setOptionE(e.target.value)}
                />
                <InsertImage
                  label="Option E Image (optional)"
                  value={optionEImage}
                  onChange={setOptionEImage}
                  folder="img_options"
                  variant="compact"
                />
              </div>

            </div>
          </div>

          {/* Answer + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ComboBox
              label="Correct Answer *"
              options={["A", "B", "C", "D", "E"]}
              value={correctAnswer}
              onChange={setCorrectAnswer}
            />

            <ComboBox
              label="Category *"
              options={
                loadingCats
                  ? [{ value: "", label: "Loading categories..." }]
                  : categories.map((c) => ({ value: c.id, label: c.name }))
              }
              value={category}
              onChange={setCategory}
              placeholder="Select category"
            />

          </div>

          {/* Explanation */}
          <div className="space-y-5">
            <InputField
              label="Explanation Text *"
              value={explanationText}
              onChange={(e) => setExplanationText(e.target.value)}
              placeholder="Explain why this is the correct answer..."
            />

            <InsertImage
              label="Explanation Image (optional)"
              value={explanationImage}
              onChange={setExplanationImage}
              folder="img_explanation"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border flex justify-end gap-4">
          <Button
            text="Cancel"
            textColor="text-foreground"
            onClick={onClose}
          />

          <Button
            text={isEdit ? "Update Question" : "Save Question"}
            backgroundColor="bg-primary"
            textColor="text-white"
            onClick={handleSave}
          />
        </div>

      </div>
    </div>
  );
}