"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Add,
  Analytical,
  Delete,
  Edit,
  General,
  Image as ImageIcon,
  Numerical,
  Questions as QuestionsIcon,
  Search,
  Sparkles,
  ToDelete,
  Verbal,
} from "@/lib/icons";
import {
  Button,
  Chip,
  ComboBox,
  InputField,
  InsertImage,
  Modal,
} from "@/lib/client-imports";
import { createClient } from "@/lib/supabase/client";
import { ChipProps } from "@/lib/types";

type QuestionRow = {
  id: string;
  text: string | null;
  img_url: string | null;
  category_id: string;
  category_name: string;
  options: string[];
  option_images: string[];
  correct_answer: string;
  explanation: string;
  explanation_img_url: string | null;
  date_added: string;
  date_added_raw: string;
};

interface QuestionFormData {
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

interface QuestionEditorModalProps {
  isOpen: boolean;
  isEdit?: boolean;
  initialData?: QuestionFormData;
  onSave?: (data: QuestionFormData) => void;
  onClose: () => void;
}

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));

const getDateRange = (
  filter: string,
): { from: string | null; to: string | null } => {
  const now = new Date();
  let from: Date | null = null;
  let to: Date | null = null;

  switch (filter) {
    case "All Time":
      return { from: null, to: null };
    case "Last 3 months":
      from = new Date();
      from.setMonth(now.getMonth() - 3);
      to = now;
      break;
    case "Last 6 months":
      from = new Date();
      from.setMonth(now.getMonth() - 6);
      to = new Date();
      to.setMonth(now.getMonth() - 3);
      break;
    case "Last 1 year":
      from = new Date();
      from.setFullYear(now.getFullYear() - 1);
      to = new Date();
      to.setMonth(now.getMonth() - 6);
      break;
    case "Last 1 year and 6 months":
      from = new Date();
      from.setFullYear(now.getFullYear() - 1);
      from.setMonth(now.getMonth() - 6);
      to = new Date();
      to.setFullYear(now.getFullYear() - 1);
      break;
    case "Last 2 years":
      from = new Date();
      from.setFullYear(now.getFullYear() - 2);
      to = new Date();
      to.setFullYear(now.getFullYear() - 1);
      break;
    case "Last 2 years and 6 months":
      from = new Date();
      from.setFullYear(now.getFullYear() - 2);
      from.setMonth(now.getMonth() - 6);
      to = new Date();
      to.setFullYear(now.getFullYear() - 2);
      break;
    case "Last 3 years and on":
      from = new Date(0);
      to = new Date();
      to.setFullYear(now.getFullYear() - 2);
      break;
  }

  return { from: from?.toISOString() || null, to: to?.toISOString() || null };
};

const getJoinedCategoryName = (
  categories: { name?: string } | { name?: string }[] | null,
) => {
  const category = Array.isArray(categories) ? categories[0] : categories;
  return category?.name || "Unknown";
};

const questionCategoryStats = [
  {
    label: "Numerical Ability",
    aliases: ["numerical ability", "numerical"],
    Icon: Numerical,
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    label: "Analytical Ability",
    aliases: ["analytical ability", "analytical"],
    Icon: Analytical,
    iconClassName: "bg-secondary/10 text-secondary",
  },
  {
    label: "Verbal Ability",
    aliases: ["verbal ability", "verbal"],
    Icon: Verbal,
    iconClassName: "bg-success/10 text-success",
  },
  {
    label: "General Information",
    aliases: ["general information", "general"],
    Icon: General,
    iconClassName: "bg-warning/10 text-warning",
  },
] as const;

const normalizeCategoryName = (name: string) => name.trim().toLowerCase();

function QuestionEditorModal({
  isOpen,
  isEdit = false,
  initialData = {},
  onSave,
  onClose,
}: QuestionEditorModalProps) {
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
  const [duplicateMatch, setDuplicateMatch] = useState<{
    text: string | null;
    options: string[];
  } | null>(null);
  const [pendingPayload, setPendingPayload] = useState<QuestionFormData | null>(null);

  const [supabase] = useState(() => createClient());
  const initializedRef = useRef(false);

  const hasAnyText = [optionA, optionB, optionC, optionD, optionE].some((value) =>
    value.trim(),
  );
  const hasAnyImage = [optionAImage, optionBImage, optionCImage, optionDImage, optionEImage].some(
    (value) => value.trim(),
  );

  useEffect(() => {
    if (!isOpen) return;

    async function loadCategories() {
      setLoadingCats(true);
      const { data } = await supabase.from("categories").select("id, name").order("name");
      if (data) setCategories(data);
      setLoadingCats(false);
    }

    loadCategories();
  }, [isOpen, supabase]);

  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      // Opening the editor intentionally hydrates its local draft from the selected question.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [isOpen, initialData]);

  const hasValue = (text: string, image: string) => text?.trim() || image?.trim();

  const normalizeText = (value?: string | null) =>
    (value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const buildPayload = (): QuestionFormData => ({
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

  const isLikelyDuplicate = (
    payload: QuestionFormData,
    existing: { text?: string | null; options?: string[] | null },
  ) => {
    const normalizedQuestion = normalizeText(payload.questionText);
    const normalizedExistingQuestion = normalizeText(existing.text);

    if (normalizedQuestion && normalizedExistingQuestion) {
      if (
        normalizedQuestion === normalizedExistingQuestion ||
        normalizedQuestion.includes(normalizedExistingQuestion) ||
        normalizedExistingQuestion.includes(normalizedQuestion)
      ) {
        return true;
      }
    }

    const payloadOptions = [payload.optionA, payload.optionB, payload.optionC, payload.optionD, payload.optionE]
      .map(normalizeText)
      .filter(Boolean);
    const existingOptions = (existing.options || [])
      .map(normalizeText)
      .filter(Boolean);

    const sharedOptionCount = payloadOptions.filter((option) => existingOptions.includes(option)).length;
    return sharedOptionCount >= 3;
  };

  const handleSave = async () => {
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

    const payload = buildPayload();

    if (!isEdit) {
      const { data: existingQuestions, error: duplicateError } = await supabase
        .from("questions")
        .select("id, text, options")
        .limit(100);

      if (duplicateError) {
        toast.error("Failed to check for duplicates");
        console.error(duplicateError);
        return;
      }

      const duplicate = existingQuestions?.find((item) => isLikelyDuplicate(payload, item));

      if (duplicate) {
        setPendingPayload(payload);
        setDuplicateMatch({
          text: duplicate.text ?? null,
          options: Array.isArray(duplicate.options) ? duplicate.options : [],
        });
        return;
      }
    }

    onSave?.(payload);
  };

  const handleProceedWithDuplicate = () => {
    if (pendingPayload) {
      onSave?.(pendingPayload);
    }
    setPendingPayload(null);
    setDuplicateMatch(null);
  };

  const handleCancelDuplicate = () => {
    setPendingPayload(null);
    setDuplicateMatch(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={
          <div className="flex items-center gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${isEdit ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>
              {isEdit ? <Edit className="size-5" /> : <Add className="size-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground md:text-lg">
                {isEdit ? "Edit question" : "Add a new question"}
              </h2>
              <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                Complete the question, choices, answer, and explanation.
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              text="Cancel"
              onClick={onClose}
              textColor="text-foreground"
              backgroundColor="bg-muted"
              className="w-full sm:w-auto"
            />
            <Button
              text={isEdit ? "Update question" : "Save question"}
              onClick={() => void handleSave()}
              textColor="text-white"
              backgroundColor={isEdit ? "bg-secondary" : "bg-primary"}
              className="w-full sm:w-auto"
            />
          </div>
        }
        contentClassName="bg-muted/15"
      >
        <div className="space-y-5 p-4 sm:p-5 md:space-y-6 md:p-6">
          <section className="rounded-2xl border border-border/80 bg-background p-4 shadow-sm md:p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">1</span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground md:text-base">Select category</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Choose where this question belongs before you add the prompt and choices.</p>
              </div>
            </div>
            <div className="space-y-3">
              <ComboBox
                label="Category *"
                options={loadingCats ? [{ value: "", label: "Loading..." }] : categories.map((categoryOption) => ({ value: categoryOption.id, label: categoryOption.name }))}
                value={category}
                onChange={setCategory}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border/80 bg-background p-4 shadow-sm md:p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">2</span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground md:text-base">Question prompt</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Enter the prompt and include an image only when useful.</p>
              </div>
            </div>
            <div className="space-y-4">
              <InputField
                label="Question text *"
                type="textarea"
                placeholder="Write the complete question..."
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
          </section>

          <section className="rounded-2xl border border-border/80 bg-background p-4 shadow-sm md:p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">3</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground md:text-base">Answer choices</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Use one consistent format for every option.</p>
                </div>
              </div>
              <div className="flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  aria-pressed={optionType === "text"}
                  onClick={() => {
                    if (hasAnyImage) {
                      toast.warning("Remove all images first before switching to text");
                      return;
                    }
                    setOptionType("text");
                  }}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition ${optionType === "text" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Text
                </button>
                <button
                  type="button"
                  aria-pressed={optionType === "image"}
                  onClick={() => {
                    if (hasAnyText) {
                      toast.warning("Remove all texts first before switching to images");
                      return;
                    }
                    setOptionType("image");
                  }}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition ${optionType === "image" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Image
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {(["A", "B", "C", "D", "E"] as const).map((label, index) => {
                const texts = [optionA, optionB, optionC, optionD, optionE];
                const setters = [setOptionA, setOptionB, setOptionC, setOptionD, setOptionE];
                const imgs = [optionAImage, optionBImage, optionCImage, optionDImage, optionEImage];
                const imgSetters = [setOptionAImage, setOptionBImage, setOptionCImage, setOptionDImage, setOptionEImage];

                return (
                  <div key={label} className="rounded-xl border border-border/80 bg-muted/20 p-3 md:p-4">
                    {optionType === "text" ? (
                      <InputField
                        label={`Option ${label}`}
                        value={texts[index]}
                        onChange={(event) => setters[index](event.target.value)}
                        placeholder="Enter option text..."
                      />
                    ) : (
                      <InsertImage
                        label={`Option ${label}`}
                        value={imgs[index]}
                        onChange={imgSetters[index]}
                        folder="img_options"
                        variant="compact"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border/80 bg-background p-4 shadow-sm md:p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">4</span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground md:text-base">Correct answer</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Choose the correct choice for this question.</p>
              </div>
            </div>
            <div className="max-w-full">
              <ComboBox
                label="Correct answer *"
                options={["A", "B", "C", "D", "E"]}
                value={correctAnswer}
                onChange={setCorrectAnswer}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border/80 bg-background p-4 shadow-sm md:p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">5</span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground md:text-base">Explanation</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Help learners understand why the selected answer is correct.</p>
              </div>
            </div>
            <div className="space-y-4">
              <InputField
                label="Explanation *"
                type="textarea"
                placeholder="Explain the correct answer..."
                value={explanationText}
                onChange={(event) => setExplanationText(event.target.value)}
              />
              <InsertImage
                label="Explanation Image"
                value={explanationImage}
                onChange={setExplanationImage}
                folder="img_explanation"
              />
            </div>
          </section>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(duplicateMatch)}
        onClose={handleCancelDuplicate}
        size="md"
        closeOnBackdrop={false}
        title={
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <ToDelete className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground md:text-lg">Possible duplicate</h2>
              <p className="mt-0.5 text-xs font-normal text-muted-foreground">Review the similar question before continuing.</p>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              text="Cancel"
              onClick={handleCancelDuplicate}
              textColor="text-foreground"
              backgroundColor="bg-muted"
              className="w-full sm:w-auto"
            />
            <Button
              text="Add anyway"
              onClick={handleProceedWithDuplicate}
              textColor="text-white"
              backgroundColor="bg-primary"
              className="w-full sm:w-auto"
            />
          </div>
        }
      >
        <div className="space-y-4 p-4 sm:p-6">
          <div className="rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs leading-relaxed text-muted-foreground">
            Adding very similar questions can make quizzes repetitive. Continue only if this is intentional.
          </div>
          <div className="rounded-xl border border-border/80 bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Existing question</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{duplicateMatch?.text || "No question text available."}</p>
          </div>
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Existing choices</p>
            <ol className="mt-3 space-y-2 text-sm text-foreground/90">
              {duplicateMatch?.options?.filter(Boolean).length ? (
                duplicateMatch.options.filter(Boolean).map((option, index) => (
                  <li key={`${option}-${index}`} className="flex gap-3 rounded-lg border border-border/70 bg-background px-3 py-2.5">
                    <span className="font-semibold text-primary">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </li>
                ))
              ) : (
                <li className="rounded-lg bg-background px-3 py-2">No choices available.</li>
              )}
            </ol>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function ManageQuestions() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState("All Time");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [categoryQuestionCounts, setCategoryQuestionCounts] = useState<
    Record<string, number>
  >({});
  const [summaryLoading, setSummaryLoading] = useState(true);
  const pageSize = 10; // Change this if you want more/fewer items per page

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuestionRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteText, setDeleteText] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteMode, setDeleteMode] = useState<"single" | "bulk" | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkActionMode, setBulkActionMode] = useState<"move" | "delete" | null>(
    null,
  );
  const [bulkMoveCategoryId, setBulkMoveCategoryId] = useState<string>("");
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        toast.error("Failed to load categories");
        console.error(error);
      } else {
        setCategories(data || []);
      }
    }
    loadCategories();
  }, [supabase]);

  const fetchQuestionSummary = useCallback(async () => {
    if (!categories.length) return;

    setSummaryLoading(true);

    const [{ count: total, error: totalError }, ...categoryResults] =
      await Promise.all([
        supabase.from("questions").select("id", { count: "exact", head: true }),
        ...categories.map((category) =>
          supabase
            .from("questions")
            .select("id", { count: "exact", head: true })
            .eq("category_id", category.id),
        ),
      ]);

    if (totalError || categoryResults.some((result) => result.error)) {
      console.error(
        "Failed to load question summary",
        totalError || categoryResults,
      );
      setSummaryLoading(false);
      return;
    }

    setTotalQuestionCount(total || 0);
    setCategoryQuestionCounts(
      categories.reduce<Record<string, number>>((counts, category, index) => {
        counts[category.id] = categoryResults[index]?.count || 0;
        return counts;
      }, {}),
    );
    setSummaryLoading(false);
  }, [categories, supabase]);

  useEffect(() => {
    void fetchQuestionSummary();
  }, [fetchQuestionSummary]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from("questions")
      .select(
        `
        id, text, img_url, category_id, options, option_images, correct_answer,
        explanation, explanation_img_url, date_added,
        categories!inner (name)
      `,
        { count: "exact" },
      )
      .order("date_added", { ascending: false })
      .range(start, end);

    if (searchTerm.trim()) {
      query = query.ilike("text", `%${searchTerm.trim()}%`);
    }

    if (selectedCategoryId !== "all") {
      query = query.eq("category_id", selectedCategoryId);
    }

    const { from, to } = getDateRange(selectedTime);

    if (from && to) {
      query = query.gte("date_added", from).lte("date_added", to);
    } else if (from) {
      query = query.gte("date_added", from);
    } else if (to) {
      query = query.lte("date_added", to);
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error("Failed to load questions");
      console.error(error);
    } else {
      const formatted = (data || []).map((q) => ({
        ...q,
        category_name: getJoinedCategoryName(
          q.categories as unknown as { name?: string } | { name?: string }[] | null,
        ),
        date_added: formatDate(q.date_added),
        date_added_raw: q.date_added,
        options: q.options || [],
        option_images: q.option_images || [],
        explanation_img_url: q.explanation_img_url || null,
      }));
      setQuestions(formatted);
      setTotalCount(count || 0);
    }

    setLoading(false);
  }, [page, searchTerm, selectedCategoryId, selectedTime, supabase]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategoryId, selectedTime]);

  useEffect(() => {
    setSelectedIds([]);
    setBulkMoveCategoryId("");
  }, [page, searchTerm, selectedCategoryId, selectedTime]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s" && !isTyping) {
        event.preventDefault();
        setBulkMode((prev) => !prev);
        setSelectedIds([]);
        setBulkMoveCategoryId("");
        setBulkActionMode(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch when page or filters change
  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleAdd = () => {
    setEditQuestion(null);
    setAddEditOpen(true);
  };

  const handleEdit = (q: QuestionRow) => {
    setEditQuestion(q);
    setAddEditOpen(true);
  };

  const handleDeleteClick = (id: string, text: string | null) => {
    setDeleteMode("single");
    setDeleteId(id);
    setDeleteText(text || "this question");
    setDeleteOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;

    setDeleteMode("bulk");
    setDeleteIds([...selectedIds]);
    setDeleteText(`${selectedIds.length} selected questions`);
    setBulkActionMode("delete");
    setDeleteOpen(true);
  };

  const toggleBulkMode = () => {
    setBulkMode((prev) => !prev);
    setSelectedIds([]);
    setBulkMoveCategoryId("");
    setBulkActionMode(null);
  };

  const openBulkMoveModal = () => {
    if (selectedIds.length === 0) return;
    setBulkActionMode("move");
    setDeleteText(`${selectedIds.length} selected questions`);
    setDeleteOpen(true);
  };

  const handleMoveSelected = async () => {
    if (!bulkMoveCategoryId || selectedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from("questions")
        .update({ category_id: bulkMoveCategoryId })
        .in("id", selectedIds);

      if (error) throw error;

      toast.success(`${selectedIds.length} question(s) moved`);
      setSelectedIds([]);
      setBulkMoveCategoryId("");
      void fetchQuestions();
      void fetchQuestionSummary();
    } catch (err) {
      console.error(err);
      toast.error("Failed to move selected questions");
    }

    setDeleteOpen(false);
    setDeleteText("");
    setBulkActionMode(null);
  };

  const handleUndoDelete = async (deletedItems: QuestionRow[]) => {
    if (!deletedItems.length) return;

    try {
      const { error } = await supabase.from("questions").insert(
        deletedItems.map((item) => ({
          id: item.id,
          text: item.text,
          img_url: item.img_url,
          category_id: item.category_id,
          options: item.options,
          option_images: item.option_images,
          correct_answer: item.correct_answer,
          explanation: item.explanation,
          explanation_img_url: item.explanation_img_url,
          date_added: item.date_added_raw || item.date_added,
        })),
      );

      if (error) throw error;

      toast.success("Deletion undone");
      void fetchQuestions();
      void fetchQuestionSummary();
    } catch (err) {
      console.error(err);
      toast.error("Failed to undo delete");
    }
  };

  const toggleSelectQuestion = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllVisible = () => {
    if (questions.length > 0 && selectedIds.length === questions.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(questions.map((q) => q.id));
  };

  const extractPath = (url: string) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split(
        "/storage/v1/object/public/revview-files/",
      );
      return parts[1] || null;
    } catch {
      return null;
    }
  };

  const confirmDelete = async () => {
    const idsToDelete = deleteMode === "bulk" ? deleteIds : deleteId ? [deleteId] : [];

    if (idsToDelete.length === 0) return;

    try {
      const { data: questionsToDelete, error: fetchError } = await supabase
        .from("questions")
        .select(
          "id, text, img_url, category_id, options, option_images, correct_answer, explanation, explanation_img_url, date_added",
        )
        .in("id", idsToDelete);

      if (fetchError) throw fetchError;

      const paths: string[] = [];

      (questionsToDelete || []).forEach((question) => {
        if (question.img_url) {
          const p = extractPath(question.img_url);
          if (p) paths.push(p);
        }

        if (question.explanation_img_url) {
          const p = extractPath(question.explanation_img_url);
          if (p) paths.push(p);
        }

        if (Array.isArray(question.option_images)) {
          question.option_images.forEach((url: string) => {
            if (url) {
              const p = extractPath(url);
              if (p) paths.push(p);
            }
          });
        }
      });

      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("revview-files")
          .remove(paths);

        if (storageError) {
          console.warn("Storage deletion error:", storageError);
        }
      }

      const { error: deleteError } = await supabase
        .from("questions")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) throw deleteError;

      const deletedItems = (questionsToDelete || []).map((q) => ({
        ...q,
        category_name: "",
        options: q.options || [],
        option_images: q.option_images || [],
        explanation_img_url: q.explanation_img_url || null,
        date_added: formatDate(q.date_added),
        date_added_raw: q.date_added,
      })) as QuestionRow[];

      toast.success(
        deleteMode === "bulk" ? "Selected questions deleted" : "Question deleted",
        {
          action: {
            label: "Undo",
            onClick: () => handleUndoDelete(deletedItems),
          },
        },
      );

      setSelectedIds([]);
      void fetchQuestions();
      void fetchQuestionSummary();
    } catch (err) {
      console.error(err);
      toast.error(
        deleteMode === "bulk"
          ? "Failed to delete selected questions"
          : "Failed to delete question",
      );
    }

    setDeleteOpen(false);
    setDeleteId(null);
    setDeleteIds([]);
    setDeleteText("");
    setDeleteMode(null);
    setBulkActionMode(null);
  };

  const handleSaveQuestion = async (formData: QuestionFormData) => {
    const payload = {
      text: formData.questionText?.trim() || null,
      img_url: formData.questionImage?.trim() || null,
      category_id: formData.category,

      options: [
        formData.optionA?.trim() || null,
        formData.optionB?.trim() || null,
        formData.optionC?.trim() || null,
        formData.optionD?.trim() || null,
        formData.optionE?.trim() || null,
      ],

      option_images: [
        formData.optionAImage?.trim() || null,
        formData.optionBImage?.trim() || null,
        formData.optionCImage?.trim() || null,
        formData.optionDImage?.trim() || null,
        formData.optionEImage?.trim() || null,
      ],

      correct_answer: formData.correctAnswer,
      explanation: formData.explanationText?.trim() || null,
      explanation_img_url: formData.explanationImage?.trim() || null,
    };

    try {
      if (editQuestion) {
        const pathsToDelete: string[] = [];

        if (editQuestion.img_url && editQuestion.img_url !== payload.img_url) {
          const p = extractPath(editQuestion.img_url);
          if (p) pathsToDelete.push(p);
        }

        if (
          editQuestion.explanation_img_url &&
          editQuestion.explanation_img_url !== payload.explanation_img_url
        ) {
          const p = extractPath(editQuestion.explanation_img_url);
          if (p) pathsToDelete.push(p);
        }

        payload.option_images.forEach((newImg: string | null, i: number) => {
          const oldImg = editQuestion.option_images?.[i];
          if (oldImg && oldImg !== newImg) {
            const p = extractPath(oldImg);
            if (p) pathsToDelete.push(p);
          }
        });

        if (pathsToDelete.length > 0) {
          await supabase.storage.from("revview-files").remove(pathsToDelete);
        }

        const { error } = await supabase
          .from("questions")
          .update(payload)
          .eq("id", editQuestion.id);

        if (error) throw error;

        toast.success("Question updated");
      } else {
        const { error } = await supabase.from("questions").insert([payload]);

        if (error) throw error;

        toast.success("Question added");
      }

      void fetchQuestions();
      void fetchQuestionSummary();
      setAddEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(editQuestion ? "Failed to update" : "Failed to add");
    }
  };

  const timeOptions = [
    "All Time",
    "Last 3 months",
    "Last 6 months",
    "Last 1 year",
    "Last 1 year and 6 months",
    "Last 2 years",
    "Last 2 years and 6 months",
    "Last 3 years and on",
  ];

  const getCategoryVariant = (categoryName: string): ChipProps["variant"] => {
    if (!categoryName) return "default";

    const firstWord = categoryName.trim().split(/\s+/)[0].toLowerCase();

    switch (firstWord) {
      case "general":
        return "general";
      case "analytical":
        return "analytical";
      case "numerical":
        return "numerical";
      case "verbal":
        return "verbal";
      default:
        return "default";
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const tableGridClassName = bulkMode
    ? "grid-cols-[40px_1fr_100px] md:grid-cols-[40px_3.2fr_1.5fr_160px] lg:grid-cols-[40px_3.2fr_1fr_90px_0.8fr_140px]"
    : "grid-cols-[1fr_100px] md:grid-cols-[3.2fr_1.5fr_160px] lg:grid-cols-[3.2fr_1fr_90px_0.8fr_140px]";

  return (
    <main className="min-h-screen bg-primary/[0.025] px-4 pb-10 pt-20 md:px-6 md:pb-12 md:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 md:gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Question bank
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Manage questions</h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">
              Create, organize, and maintain the questions learners use throughout RevView.
            </p>
          </div>

          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={toggleBulkMode}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              {bulkMode ? "Cancel selection" : "Select multiple"}
            </button>
            <Button
              text="Add question"
              backgroundColor="bg-primary"
              textColor="text-white"
              leftIcon={<Add className="size-4" />}
              onClick={handleAdd}
              className="w-full sm:w-auto"
            />
          </div>
        </header>

        <section aria-label="Question summary" className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <article className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground md:text-sm">Total Questions</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{summaryLoading ? "—" : totalQuestionCount}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><QuestionsIcon className="size-5" /></div>
            </div>
          </article>
          {questionCategoryStats.map(({ label, aliases, Icon, iconClassName }) => {
            const category = categories.find(({ name }) =>
              aliases.some((alias) => alias === normalizeCategoryName(name)),
            );

            return (
              <article key={label} className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground md:text-sm">{label}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {summaryLoading ? "—" : category ? categoryQuestionCounts[category.id] || 0 : 0}
                    </p>
                  </div>
                  <div className={`flex size-10 items-center justify-center rounded-xl ${iconClassName}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 items-end gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:grid-cols-2 md:p-5 lg:grid-cols-4 lg:p-6">
          <div className="w-full col-span-1 md:col-span-2">
            <InputField
              label="Search Question"
              icon={<Search />}
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-full col-span-1">
            <ComboBox
              label="Category"
              placeholder="All Categories"
              options={[
                { value: "all", label: "All Categories" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
              isSearchable={false}
            />
          </div>

          <div className="w-auto col-span-1">
            <ComboBox
              label="Date Added"
              placeholder="All Time"
              options={timeOptions.map((t) => ({ value: t, label: t }))}
              value={selectedTime}
              onChange={setSelectedTime}
              isSearchable={false}
            />
          </div>

        </section>

        {loading ? (
          <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm" aria-label="Loading questions">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-4 text-center shadow-sm">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <QuestionsIcon className="size-5" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">No questions found</h2>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Try changing your filters or add a new question to the bank.
            </p>
          </div>
        ) : (
          <>
            {bulkMode && (
              <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-foreground">
                    {selectedIds.length > 0
                      ? `${selectedIds.length} items are selected. Do you wish to modify or delete them?`
                      : "Select questions to modify or delete them."}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      text="Move Selected"
                      backgroundColor="bg-primary"
                      textColor="text-white"
                      onClick={openBulkMoveModal}
                      isDisabled={selectedIds.length === 0}
                    />
                    <Button
                      text="Delete Selected"
                      backgroundColor="bg-destructive"
                      textColor="text-white"
                      borderColor="border-destructive"
                      onClick={handleBulkDeleteClick}
                      isDisabled={selectedIds.length === 0}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 md:hidden">
              {questions.map((question) => {
                const isSelected = selectedIds.includes(question.id);

                return (
                  <article
                    key={question.id}
                    className={`rounded-xl border p-4 transition ${
                      isSelected ? "border-primary/30 bg-primary/5" : "border-border/80 bg-card"
                    }`}
                    onClick={() => bulkMode && toggleSelectQuestion(question.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        {bulkMode && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectQuestion(question.id)}
                            onClick={(event) => event.stopPropagation()}
                            className="mt-0.5 size-4 shrink-0 rounded border-border text-primary focus:ring-primary"
                            aria-label={`Select ${question.text || "question"}`}
                          />
                        )}
                        <h2 className="line-clamp-3 text-sm font-semibold leading-relaxed text-foreground">
                          {question.text || "Image-only question"}
                        </h2>
                      </div>
                      {(question.img_url || question.explanation_img_url) && (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ImageIcon className="size-4" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Chip text={question.category_name} variant={getCategoryVariant(question.category_name)} />
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                        Answer: {question.correct_answer}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{question.date_added}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/70 pt-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEdit(question);
                        }}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15"
                      >
                        <Edit className="size-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClick(question.id, question.text);
                        }}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/15"
                      >
                        <Delete className="size-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Table */}
            <div className="hidden overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm md:block">
              <div className={`min-w-full grid ${tableGridClassName} divide-y divide-border`}>

                <div className="contents text-xs md:text-sm lg:text-base">
                  {bulkMode && (
                    <div className="bg-muted/40 font-semibold py-3 px-2 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={
                          questions.length > 0 && selectedIds.length === questions.length
                        }
                        onChange={handleSelectAllVisible}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        aria-label="Select all questions"
                      />
                    </div>
                  )}
                  <div className="bg-muted/40 font-semibold py-3 px-4 flex items-center justify-start">
                    Question
                  </div>
                  <div className="hidden md:flex bg-muted/40 font-semibold py-3 px-4 items-center justify-start">
                    Category
                  </div>
                  <div className="hidden lg:flex bg-muted/40 font-semibold py-3 px-4 items-center justify-center">
                    Answer
                  </div>
                  <div className="hidden lg:flex bg-muted/40 font-semibold py-3 px-4 items-center justify-start">
                    Added
                  </div>
                  <div className="bg-muted/40 font-semibold py-3 px-4 flex justify-center items-center">
                    Actions
                  </div>
                </div>

                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="contents group transition-colors hover:bg-muted/20"
                  >
                    {bulkMode && (
                      <div className="py-3 px-2 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(q.id)}
                          onChange={() => toggleSelectQuestion(q.id)}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          aria-label={`Select ${q.text || "question"}`}
                        />
                      </div>
                    )}

                    {/* Question */}
                    <div className="flex items-center gap-2 whitespace-normal wrap-break-word px-4 py-3 text-xs md:text-sm lg:text-base">
                      <span className="line-clamp-2 leading-snug">
                        {q.text || "Image only"}
                      </span>
                      {(q.img_url || q.explanation_img_url) && (
                        <ImageIcon size={14} className="text-primary shrink-0 mt-0.5" />
                      )}
                    </div>

                    {/* Category */}
                    <div className="hidden md:flex py-3 px-4 items-center">
                      <Chip
                        text={q.category_name}
                        variant={getCategoryVariant(q.category_name)}
                      />
                    </div>

                    {/* Answer */}
                    <div className="hidden lg:flex py-3 px-4 font-semibold text-primary items-center justify-center">
                      {q.correct_answer}
                    </div>

                    {/* Added */}
                    <div className="hidden lg:flex py-3 px-4 text-muted-foreground items-center">
                      {q.date_added}
                    </div>

                    {/* Actions */}
                    <div
                      className="py-3 px-4 flex items-center justify-center gap-1 md:gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        leftIcon={<Edit size={14} />}
                        backgroundColor="bg-primary/20"
                        textColor="text-primary"
                        onClick={() => handleEdit(q)}
                      />
                      <Button
                        leftIcon={<Delete size={14} />}
                        backgroundColor="bg-destructive/20"
                        textColor="text-destructive"
                        onClick={() => handleDeleteClick(q.id, q.text)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="w-full flex flex-col md:flex-row items-center space-y-2 justify-between mt-2 md:mt-3 lg:mt-4 px-2 md:px-4 lg:px-6">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, totalCount)} of {totalCount}{" "}
                  questions
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    text="Previous"
                    onClick={() => goToPage(page - 1)}
                    isDisabled={page === 1}
                    backgroundColor="bg-primary"
                    textColor="text-white"
                  />
                  <div className="hidden md:flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;

                      if (totalPages > 5) {
                        if (page > 3 && page < totalPages - 2) {
                          pageNum = page - 2 + i;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        }
                      }

                      return (
                        <Button
                          key={pageNum}
                          text={pageNum.toString()}
                          onClick={() => goToPage(pageNum)}
                          backgroundColor={
                            page === pageNum
                              ? "bg-card border border-primary"
                              : "bg-card border border-border"
                          }
                          textColor={
                            page === pageNum ? "text-primary font-medium" : "text-foreground/75"
                          }
                          className="min-w-10"
                        />
                      );
                    })}
                  </div>
                  <div className="md:hidden">
                    <Button
                      text={`${page} / ${totalPages}`}
                      backgroundColor="bg-card border border-primary"
                      textColor="text-primary font-medium"
                      className="min-w-16 cursor-default pointer-events-none"
                    />
                  </div>

                  <Button
                    text="Next"
                    onClick={() => goToPage(page + 1)}
                    isDisabled={page === totalPages}
                    backgroundColor="bg-primary"
                    textColor="text-white"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <QuestionEditorModal
        isOpen={addEditOpen}
        isEdit={!!editQuestion}
        initialData={
          editQuestion
            ? {
                questionText: editQuestion.text || "",
                questionImage: editQuestion.img_url || "",
                optionA: editQuestion.options[0] || "",
                optionB: editQuestion.options[1] || "",
                optionC: editQuestion.options[2] || "",
                optionD: editQuestion.options[3] || "",
                optionE: editQuestion.options[4] || "",
                optionAImage: editQuestion.option_images[0] || "",
                optionBImage: editQuestion.option_images[1] || "",
                optionCImage: editQuestion.option_images[2] || "",
                optionDImage: editQuestion.option_images[3] || "",
                optionEImage: editQuestion.option_images[4] || "",
                correctAnswer: editQuestion.correct_answer,
                category: editQuestion.category_id,
                explanationText: editQuestion.explanation || "",
                explanationImage: editQuestion.explanation_img_url || "",
              }
            : undefined
        }
        onSave={handleSaveQuestion}
        onClose={() => setAddEditOpen(false)}
      />

      <Modal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
          setDeleteIds([]);
          setDeleteText("");
          setDeleteMode(null);
          setBulkActionMode(null);
        }}
        size="md"
        title={
          <div className="flex items-center gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${bulkActionMode === "move" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
              {bulkActionMode === "move" ? <QuestionsIcon className="size-5" /> : <Delete className="size-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground md:text-lg">
                {bulkActionMode === "move"
                  ? "Move selected questions"
                  : deleteMode === "bulk"
                    ? "Delete selected questions"
                    : "Delete question"}
              </h2>
              <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                {bulkActionMode === "move" ? "Choose a destination category." : "This permanently removes the selected content."}
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              text="Cancel"
              backgroundColor="bg-muted"
              textColor="text-foreground"
              className="w-full sm:w-auto"
              onClick={() => {
                setDeleteOpen(false);
                setDeleteId(null);
                setDeleteIds([]);
                setDeleteText("");
                setDeleteMode(null);
                setBulkActionMode(null);
              }}
            />
            <Button
              text={bulkActionMode === "move" ? "Move questions" : deleteMode === "bulk" ? "Delete questions" : "Delete question"}
              backgroundColor={bulkActionMode === "move" ? "bg-primary" : "bg-destructive"}
              textColor="text-white"
              leftIcon={bulkActionMode === "move" ? <QuestionsIcon className="size-4" /> : <Delete className="size-4" />}
              onClick={bulkActionMode === "move" ? () => void handleMoveSelected() : () => void confirmDelete()}
              isDisabled={bulkActionMode === "move" && !bulkMoveCategoryId}
              className="w-full sm:w-auto"
            />
          </div>
        }
      >
        <div className="space-y-4 p-4 sm:p-6">
          {bulkActionMode === "move" && (
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
              <ComboBox
                label="Destination category"
                placeholder="Select category"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                value={bulkMoveCategoryId}
                onChange={setBulkMoveCategoryId}
                isSearchable={false}
              />
            </div>
          )}

          {deleteText && bulkActionMode !== "move" && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">You are deleting</p>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground">“{deleteText}”</p>
              <p className="mt-3 text-xs text-muted-foreground">Deleted questions can only be restored immediately using the undo notification.</p>
            </div>
          )}
        </div>
      </Modal>

    </main>
  );
}
