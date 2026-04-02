"use client";

import { useState, useEffect, useRef } from "react";
import { InputField, Button, ComboBox, InsertImage } from "@/lib/client-imports";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Add, Edit } from "@/lib/icons";

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

  const [optionType, setOptionType] = useState<"text" | "image">("text");

  const [correctAnswer, setCorrectAnswer] = useState("");
  const [category, setCategory] = useState("");

  const [explanationText, setExplanationText] = useState("");
  const [explanationImage, setExplanationImage] = useState("");

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const supabase = createClient();
  const modalRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const hasAnyText = [optionA, optionB, optionC, optionD, optionE].some(v => v.trim());
  const hasAnyImage = [optionAImage, optionBImage, optionCImage, optionDImage, optionEImage].some(v => v.trim());

  useEffect(() => {
    if (!isOpen) return;

    async function loadCategories() {
      setLoadingCats(true);
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (data) setCategories(data);
      setLoadingCats(false);
    }

    loadCategories();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !initializedRef.current) {
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

      initializedRef.current = true;
    }

    if (!isOpen) initializedRef.current = false;
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  const hasValue = (text: string, image: string) =>
    (text?.trim() || image?.trim());

  const handleSave = () => {
    if (!questionText.trim()) {
      toast.error("Question is required");
      return;
    }

    if (!hasValue(optionA, optionAImage)) {
      toast.error("Option A is required");
      return;
    }

    if (!hasValue(optionB, optionBImage)) {
      toast.error("Option B is required");
      return;
    }

    if (!hasValue(optionC, optionCImage)) {
      toast.error("Option C is required");
      return;
    }

    if (!hasValue(optionD, optionDImage)) {
      toast.error("Option D is required");
      return;
    }

    if (!correctAnswer || !category) {
      toast.error("Please select correct answer and category");
      return;
    }

    if (!hasValue(explanationText, explanationImage)) {
      toast.error("Explanation is required");
      return;
    }

    onSave?.({
      questionText,
      questionImage,
      optionA,
      optionB,
      optionC,
      optionD,
      optionE,
      optionAImage,
      optionBImage,
      optionCImage,
      optionDImage,
      optionEImage,
      correctAnswer,
      category,
      explanationText,
      explanationImage,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 lg:p-8"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-5xl bg-background rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex justify-center items-center gap-1 md:gap-1.5 lg:gap-2 px-4 md:px-5 lg:px-6 py-3 md:py-4 lg:py-5 border-b">
          {
            isEdit ? ( <Edit className="text-secondary"/> ) : (<Add className="text-primary"/>)
          }
          <h2 className="text-base md:text-lg lg:text-xl font-semibold">
            {isEdit ? "Edit Question" : "Add New Question"}
          </h2>
        </div>

        <div className="p-4 md:p-5 lg:p-6 space-y-8 h-[70vh] overflow-y-auto">

          {/* Question */}
          <div className="space-y-2 md:space-y-4 lg:space-y-4">
            <InputField
              label="Question Text *"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <InsertImage
              label="Question Image"
              value={questionImage}
              onChange={setQuestionImage}
              folder="img_question"
            />
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-4 lg:space-y-5 border-y border-foreground/15 p-2 md:p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold">Options</h3>

              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => {
                    if (hasAnyImage) {
                      toast.warning("Remove all images first before switching to text");
                      return;
                    }
                    setOptionType("text");
                  }}
                  className={`px-3 md:px-3.5 lg:px-4 py-1 md:py-1.5 lg:py-2 text-[10px] md:text-xs lg:text-sm rounded-md transition
                    ${optionType === "text" ? "bg-primary text-white" : ""}
                  `}
                >
                  Texts
                </button>

                <button
                  onClick={() => {
                    if (hasAnyText) {
                      toast.warning("Remove all texts first before switching to images");
                      return;
                    }
                    setOptionType("image");
                  }}
                  className={`px-3 md:px-3.5 lg:px-4 py-1 md:py-1.5 lg:py-2 text-[10px] md:text-xs lg:text-sm rounded-md transition
                    ${optionType === "image" ? "bg-primary text-white" : ""}
                  `}
                >
                  Images
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
              {["A", "B", "C", "D", "E"].map((label, i) => {
                const texts = [optionA, optionB, optionC, optionD, optionE];
                const setters = [setOptionA, setOptionB, setOptionC, setOptionD, setOptionE];
                const imgs = [optionAImage, optionBImage, optionCImage, optionDImage, optionEImage];
                const imgSetters = [setOptionAImage, setOptionBImage, setOptionCImage, setOptionDImage, setOptionEImage];

                return (
                  <div key={label} className="border rounded-xl  p-2 md:p-3 lg:p-4 space-y-2 md:space-y-2.5 lg:space-y-3">

                    {optionType === "text" ? (
                      <InputField
                        label={`Option ${label}`}
                        value={texts[i]}
                        onChange={(e) => setters[i](e.target.value)}
                        placeholder="Enter option text..."
                      />
                    ) : (
                      <InsertImage
                        label={`Option ${label}`}
                        value={imgs[i]}
                        onChange={imgSetters[i]}
                        folder="img_options"
                        variant="compact"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Answer + Category */}
          <div className="grid md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 border-b pb-2 md:pb-3 lg:pb-4">
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
                  ? [{ value: "", label: "Loading..." }]
                  : categories.map((c) => ({ value: c.id, label: c.name }))
              }
              value={category}
              onChange={setCategory}
            />
          </div>

          {/* Explanation */}
          <div className="space-y-2 md:space-y-3 lg:space-y-4">
            <InputField
              label="Explanation"
              value={explanationText}
              onChange={(e) => setExplanationText(e.target.value)}
            />
            <InsertImage
              label="Explanation Image"
              value={explanationImage}
              onChange={setExplanationImage}
              folder="img_explanation"
            />
          </div>

        </div>

        <div className="flex justify-end gap-2 md:gap-2.5 lg:gap-3 px-4 md:px-5 lg:px-6 py-2 md:py-3 lg:py-4 border-t">
          <Button text="Cancel" onClick={onClose} textColor="text-foreground" backgroundColor="bg-white" borderColor="border-foreground/50" className="w-full"/>
          <Button text={isEdit ? "Update" : "Save"} onClick={handleSave} textColor="text-white" backgroundColor={isEdit ? "bg-secondary" : "bg-primary"} className="w-full"/>
        </div>

      </div>
    </div>
  );
}