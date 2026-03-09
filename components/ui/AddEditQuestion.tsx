"use client";

import { InputField, Button, ComboBox, InsertImage } from "@/lib/client-imports";
import React, { useState, useEffect, useRef } from "react";

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

const AddEditQuestion: React.FC<AddEditQuestionProps> = ({
  isOpen,
  isEdit = false,
  initialData = {},
  onSave,
  onClose,
}) => {
  const [questionText, setQuestionText] = useState(initialData.questionText || "");
  const [questionImage, setQuestionImage] = useState(initialData.questionImage || "");
  const [optionA, setOptionA] = useState(initialData.optionA || "");
  const [optionAImage, setOptionAImage] = useState(initialData.optionAImage || "");
  const [optionB, setOptionB] = useState(initialData.optionB || "");
  const [optionBImage, setOptionBImage] = useState(initialData.optionBImage || "");
  const [optionC, setOptionC] = useState(initialData.optionC || "");
  const [optionCImage, setOptionCImage] = useState(initialData.optionCImage || "");
  const [optionD, setOptionD] = useState(initialData.optionD || "");
  const [optionDImage, setOptionDImage] = useState(initialData.optionDImage || "");
  const [optionE, setOptionE] = useState(initialData.optionE || "");
  const [optionEImage, setOptionEImage] = useState(initialData.optionEImage || "");
  const [correctAnswer, setCorrectAnswer] = useState(initialData.correctAnswer || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [explanationText, setExplanationText] = useState(initialData.explanationText || "");
  const [explanationImage, setExplanationImage] = useState(initialData.explanationImage || "");

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
  }, [isOpen, initialData]);

  const modalRef = useRef<HTMLDivElement>(null);

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

    const required = [questionText, correctAnswer, category];
    const requiredOptions = [optionA, optionB, optionC, optionD];

    if (required.some((v) => !v?.trim())) {
      alert("Please fill in all required fields (*)");
      return;
    }

    if (requiredOptions.some((v) => !v?.trim())) {
      alert("Options A–D are required");
      return;
    }

    onSave?.(data);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          flex flex-col w-full max-w-5xl max-h-[95vh] mx-4 md:mx-8 
          bg-background rounded-xl border border-border 
          shadow-2xl overflow-hidden
          scale-100 animate-in fade-in-60 zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border bg-background/80">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Question" : "Add New Question"}
          </h2>
        </div>

        {/* Scrollable Content */}
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
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(["A", "B", "C", "D", "E"] as const).map((letter) => {
                const optKey = `option${letter}` as keyof typeof initialData;
                const imgKey = `option${letter}Image` as keyof typeof initialData;

                const textState = eval(`option${letter}`) as string;
                const setText = eval(`setOption${letter}`) as React.Dispatch<React.SetStateAction<string>>;
                const imgState = eval(`option${letter}Image`) as string;
                const setImg = eval(`setOption${letter}Image`) as React.Dispatch<React.SetStateAction<string>>;

                return (
                  <React.Fragment key={letter}>
                    <div className="md:col-span-2">
                      <InputField
                        label={`Option ${letter}${letter !== "E" ? " *" : ""}`}
                        value={textState}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`Enter option ${letter}${letter !== "E" ? "" : " (optional)"}...`}
                      />
                    </div>
                    <InsertImage
                      label={`Option ${letter} Image${letter !== "E" ? "" : " (optional)"}`}
                      value={imgState}
                      onChange={setImg}
                      variant="compact"
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Correct Answer + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ComboBox
              label="Correct Answer *"
              options={["A", "B", "C", "D", "E"]}
              value={correctAnswer}
              onChange={setCorrectAnswer}
            />
            <ComboBox
              label="Category *"
              options={["Numerical Ability", "Verbal Ability", "Logical Reasoning", "General Knowledge", "Other"]}
              value={category}
              onChange={setCategory}
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
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border bg-background/95 backdrop-blur-sm flex justify-end gap-4">
          <Button
            text="Cancel"
            textColor="text-foreground"
            onClick={onClose}
            size="md"
          />
          <Button
            text={isEdit ? "Update Question" : "Save Question"}
            backgroundColor="bg-primary"
            textColor="text-white"
            onClick={handleSave}
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditQuestion;