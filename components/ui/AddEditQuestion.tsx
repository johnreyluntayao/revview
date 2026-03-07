// components/AddEditQuestion.tsx
"use client";

import { InputField, Button, ComboBox, InsertImage } from "@/lib/client-imports";
import React, { useState } from "react";
interface QuestionData {
  mode?: "Text" | "Image";
  questionText?: string;
  questionImage?: string;
  optionA?: string; 
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string;
  correctAnswer?: string;
  category?: string;
  explanationText?: string;
  explanationImage?: string;
}

interface AddEditQuestionProps {
  isEdit?: boolean;
  initialData?: QuestionData;
  onSave?: (data: QuestionData) => void;
  onCancel?: () => void;
}

const AddEditQuestion: React.FC<AddEditQuestionProps> = ({
  isEdit = false,
  initialData = {},
  onSave,
  onCancel,
}) => {
  const [mode, setMode] = useState<"Text" | "Image">(
    initialData.mode || "Text"
  );

  const [questionText, setQuestionText] = useState(initialData.questionText || "");
  const [questionImage, setQuestionImage] = useState(initialData.questionImage || "");

  const [optionA, setOptionA] = useState(initialData.optionA || "");
  const [optionB, setOptionB] = useState(initialData.optionB || "");
  const [optionC, setOptionC] = useState(initialData.optionC || "");
  const [optionD, setOptionD] = useState(initialData.optionD || "");
  const [optionE, setOptionE] = useState(initialData.optionE || "");

  const [correctAnswer, setCorrectAnswer] = useState(initialData.correctAnswer || "");
  const [category, setCategory] = useState(initialData.category || "");

  const [explanationText, setExplanationText] = useState(initialData.explanationText || "");
  const [explanationImage, setExplanationImage] = useState(initialData.explanationImage || "");

  const handleSave = () => {
    const data: QuestionData = {
      mode,
      questionText: mode === "Text" ? questionText : undefined,
      questionImage: mode === "Image" ? questionImage : undefined,
      optionA: optionA.trim() || undefined,
      optionB: optionB.trim() || undefined,
      optionC: optionC.trim() || undefined,
      optionD: optionD.trim() || undefined,
      optionE: optionE.trim() || undefined,
      correctAnswer,
      category,
      explanationText: mode === "Text" ? explanationText : undefined,
      explanationImage: mode === "Image" ? explanationImage : undefined,
    };

    // Basic validation
    const requiredFields = [optionA, optionB, optionC, optionD, correctAnswer, category];

    if (requiredFields.some((v) => !v?.trim())) {
      alert("Please fill in all required fields (*)");
      return;
    }

    if (mode === "Text") {
      if (!questionText.trim() || !explanationText.trim()) {
        alert("Question and explanation text are required in Text mode");
        return;
      }
    } else {
      if (!questionImage.trim() || !explanationImage.trim()) {
        alert("Question and explanation images are required in Image mode");
        return;
      }
      // Optional: also require image for A,B,C,D (or make them optional)
    }

    onSave?.(data);
  };

  // Reusable Option renderer that switches based on global mode
  const OptionInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => {
    const isRequired = !label.includes("E");

    if (mode === "Text") {
      return (
        <InputField
          label={`${label} ${isRequired ? "*" : "(optional)"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      );
    }

    return (
      <InsertImage
        label={`${label} Image ${isRequired ? "*" : "(optional)"}`}
        value={value}
        onChange={onChange}
        placeholder="Drag & drop, upload or paste image URL..."
      />
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-background rounded-xl border border-border shadow-sm space-y-7">
      <h2 className="text-2xl font-bold text-foreground">
        {isEdit ? "Edit Question" : "Add New Question"}
      </h2>

      {/* Single global mode toggle */}
      <ComboBox
        label="Content Mode (Question, Options & Explanation)"
        options={["Text", "Image"]}
        value={mode}
        onChange={(val) => setMode(val as "Text" | "Image")}
        size="md"
      />

      {/* Question */}
      {mode === "Text" ? (
        <InputField
          label="Question Text *"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter the full question here..."
        />
      ) : (
        <InsertImage
          label="Question Image *"
          value={questionImage}
          onChange={setQuestionImage}
        />
      )}

      {/* Options – now follow the same mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OptionInput label="Option A" value={optionA} onChange={setOptionA} />
        <OptionInput label="Option B" value={optionB} onChange={setOptionB} />
        <OptionInput label="Option C" value={optionC} onChange={setOptionC} />
        <OptionInput label="Option D" value={optionD} onChange={setOptionD} />
        <OptionInput label="Option E" value={optionE} onChange={setOptionE} />
      </div>

      {/* Correct Answer + Category (always text) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ComboBox
          label="Correct Answer *"
          options={["A", "B", "C", "D", "E"]}
          value={correctAnswer}
          onChange={setCorrectAnswer}
          placeholder="Select correct option..."
        />
        <ComboBox
          label="Category *"
          options={["Numerical Ability", "Verbal Ability", "Logical Reasoning", "General Knowledge", "Other"]}
          value={category}
          onChange={setCategory}
        />
      </div>

      {/* Explanation – follows same mode */}
      {mode === "Text" ? (
        <InputField
          label="Explanation *"
          value={explanationText}
          onChange={(e) => setExplanationText(e.target.value)}
          placeholder="Explain why this is the correct answer..."
        />
      ) : (
        <InsertImage
          label="Explanation Image *"
          value={explanationImage}
          onChange={setExplanationImage}
        />
      )}

      <div className="flex justify-end gap-4 pt-6">
        <Button
          text="Cancel"
          textColor="text-foreground"
          onClick={onCancel}
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
  );
};

export default AddEditQuestion;