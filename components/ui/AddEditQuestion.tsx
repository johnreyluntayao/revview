// components/AddEditQuestion.tsx
"use client";

import { InputField, Button, ComboBox, InsertImage } from "@/lib/client-imports";
import React, { useState } from "react";

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

  return (
      <div className="flex flex-col h-[95vh] w-full max-w-5xl mx-auto bg-background rounded-xl border border-border overflow-hidden">
        {/* Fixed Header */}
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
              {/* A */}
              <div className="md:col-span-2">
                <InputField
                  label="Option A *"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Enter option A..."
                />
              </div>
              <InsertImage
                label="Option A Image"
                value={optionAImage}
                onChange={setOptionAImage}
                variant="compact"
              />

              {/* B */}
              <div className="md:col-span-2">
                <InputField
                  label="Option B *"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Enter option B..."
                />
              </div>
              <InsertImage
                label="Option B Image"
                value={optionBImage}
                onChange={setOptionBImage}
                variant="compact"
              />

              {/* C */}
              <div className="md:col-span-2">
                <InputField
                  label="Option C *"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Enter option C..."
                />
              </div>
              <InsertImage
                label="Option C Image"
                value={optionCImage}
                onChange={setOptionCImage}
                variant="compact"
              />

              {/* D */}
              <div className="md:col-span-2">
                <InputField
                  label="Option D *"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Enter option D..."
                />
              </div>
              <InsertImage
                label="Option D Image"
                value={optionDImage}
                onChange={setOptionDImage}
                variant="compact"
              />

              {/* E */}
              <div className="md:col-span-2">
                <InputField
                  label="Option E (optional)"
                  value={optionE}
                  onChange={(e) => setOptionE(e.target.value)}
                  placeholder="Enter option E (optional)..."
                />
              </div>
              <InsertImage
                label="Option E Image (optional)"
                value={optionEImage}
                onChange={setOptionEImage}
                variant="compact"
              />
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

        {/* Fixed Bottom Bar */}
        <div className="px-6 py-5 border-t border-border bg-background/95 backdrop-blur-sm flex justify-end gap-4">
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