"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Add, Delete, Edit, Search, Image as ImageIcon } from "@/lib/icons";
import {
  Button,
  Chip,
  ComboBox,
  InputField,
  AddEditQuestion,
  DeletePopup,
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
};

export default function ManageQuestions() {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionRow | null>(
    null,
  );

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
  const pageSize = 10; // Change this if you want more/fewer items per page

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuestionRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteText, setDeleteText] = useState("");

  const supabase = createClient();

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
  }, []);

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const getDateRange = (
    filter: string,
  ): { from: string | null; to: string | null } => {
    const now = new Date();
    let from = null;
    let to = null;

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

  const fetchQuestions = async () => {
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
      const formatted = (data || []).map((q: any) => ({
        ...q,
        category_name: q.categories?.name || "Unknown",
        date_added: formatDate(q.date_added),
        options: q.options || [],
        option_images: q.option_images || [],
        explanation_img_url: q.explanation_img_url || null,
      }));
      setQuestions(formatted);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategoryId, selectedTime]);

  // Fetch when page or filters change
  useEffect(() => {
    fetchQuestions();
  }, [page, searchTerm, selectedCategoryId, selectedTime]);

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
    setDeleteId(id);
    setDeleteText(text || "this question");
    setDeleteOpen(true);
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
    if (!deleteId) return;

    try {
      const { data: question, error: fetchError } = await supabase
        .from("questions")
        .select("img_url, option_images, explanation_img_url")
        .eq("id", deleteId)
        .single();

      if (fetchError) throw fetchError;

      const paths: string[] = [];

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
        .eq("id", deleteId);

      if (deleteError) throw deleteError;

      toast.success("Question deleted");

      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete question");
    }

    setDeleteOpen(false);
    setDeleteId(null);
  };

  const handleSaveQuestion = async (formData: any) => {
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

      fetchQuestions();
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

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-20 md:py-24 lg:py-28">
      <div className="gap-4 md:gap-6 lg:gap-8 flex flex-col">
        <div className="">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
            Manage Questions
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground mt-1">
            Add, Edit, and Delete your quiz questions here. Use the filters to
            find specific questions or view all of them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 grid-rows-4 md:grid-rows-3 lg:grid-rows-1 items-end gap-2 md:gap-3 lg:gap-4 border border-border rounded-xl p-4 md:p-6 lg:p-6 bg-white">
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

          <div className="w-full flex justify-end md:col-span-2 lg:col-span-1">
            <Button
              text="Add New Question"
              backgroundColor="bg-linear-to-r from-primary to-secondary"
              textColor="text-white"
              leftIcon={<Add />}
              onClick={handleAdd}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No questions found
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
              <div className="min-w-full grid grid-cols-[1fr_100px] md:grid-cols-[3fr_1fr_100px_160px] lg:grid-cols-[3fr_1fr_100px_1fr_180px] divide-y divide-border">
                {/* Header */}
                <div className="contents text-xs md:text-sm lg:text-base">
                  <div className="bg-muted/40 font-semibold py-3 px-4">
                    Question
                  </div>

                  {/* Category (hidden on mobile only) */}
                  <div className="hidden md:flex bg-muted/40 font-semibold py-3 px-4 items-center text-center">
                    Category
                  </div>

                  {/* Answer (hidden on mobile only) */}
                  <div className="hidden md:flex bg-muted/40 font-semibold py-3 px-4 items-center justify-center">
                    Answer
                  </div>

                  {/* Added (ONLY desktop) */}
                  <div className="hidden lg:flex bg-muted/40 font-semibold py-3 px-4 items-center">
                    Added
                  </div>

                  <div className="bg-muted/40 font-semibold py-3 px-4 text-center">
                    Actions
                  </div>
                </div>
                {/* Rows */}
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="contents group hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedQuestion(q);
                      setViewOpen(true);
                    }}
                  >
                    {/* Question */}
                    <div className="py-3 px-4 text-xs md:text-sm flex items-center gap-2 whitespace-normal break-words">
                      <span className="line-clamp-2">
                        {q.text || "Image only"}
                      </span>

                      {(q.img_url || q.explanation_img_url) && (
                        <ImageIcon size={14} className="text-primary" />
                      )}
                    </div>

                    {/* Category */}
                    <div className="hidden md:flex py-3 px-4 items-center">
                      <Chip
                        text={q.category_name}
                        variant={getCategoryVariant(q.category_name)}
                        className="text-xs"
                      />
                    </div>

                    {/* Answer */}
                    <div className="hidden md:flex py-3 px-4 text-sm font-semibold text-primary items-center justify-center">
                      {q.correct_answer}
                    </div>

                    {/* Added (ONLY desktop) */}
                    <div className="hidden lg:flex py-3 px-4 text-xs text-muted-foreground items-center">
                      {q.date_added}
                    </div>

                    {/* Actions */}
                    <div
                      className="py-3 px-4 flex items-center justify-end gap-1 md:gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        leftIcon={<Edit size={14} />}
                        backgroundColor="bg-primary/20"
                        textColor="text-primary"
                        className="p-1 md:p-2"
                        onClick={() => handleEdit(q)}
                      />
                      <Button
                        leftIcon={<Delete size={14} />}
                        backgroundColor="bg-destructive/20"
                        textColor="text-destructive"
                        className="p-1 md:p-2"
                        onClick={() => handleDeleteClick(q.id, q.text)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-2">
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
                    backgroundColor="bg-card border border-border"
                    textColor="text-foreground"
                  />

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
                            ? "bg-primary text-white"
                            : "bg-transparent border border-border"
                        }
                        textColor={
                          page === pageNum ? "text-white" : "text-foreground"
                        }
                        className="min-w-10"
                      />
                    );
                  })}

                  <Button
                    text="Next"
                    onClick={() => goToPage(page + 1)}
                    isDisabled={page === totalPages}
                    backgroundColor="bg-card border border-border"
                    textColor="text-foreground"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddEditQuestion
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

      <DeletePopup
        isOpen={deleteOpen}
        questionText={deleteText}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      {viewOpen && selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-4 md:p-6 space-y-4 shadow-lg overflow-y-auto max-h-[90vh]">
            {/* Title */}
            <h2 className="text-sm lg:text-lg md:text-base font-bold">Question Details</h2>

            {/* Question Text */}
            <div>
              <p className="font-medium text-xs lg:text-base md:text-sm">Question:</p>
              <p className="text-muted-foreground mt-1">
                {selectedQuestion.text || "Image only"}
              </p>
            </div>

            {/* Question Image */}
            {selectedQuestion.img_url && (
              <div className="mt-2 w-full h-60 border border-dashed border-border rounded-md flex items-center justify-center bg-muted/20 overflow-hidden">
                <img
                  src={selectedQuestion.img_url}
                  alt="Question"
                  className="max-w-full max-h-full object-contain cursor-pointer"
                  onClick={() =>
                    window.open(selectedQuestion.img_url!, "_blank")
                  }
                />
              </div>
            )}

            {/* Category */}
            <div>
              <p className="font-medium text-xs lg:text-base md:text-sm">Category:</p>
              <Chip
                text={selectedQuestion.category_name}
                variant={getCategoryVariant(selectedQuestion.category_name)}
                className="mt-1"
              />
            </div>

            {/* Answer */}
            <div>
              <p className="font-medium text-xs lg:text-base md:text-sm">Correct Answer:</p>
              <p className="text-primary font-semibold">
                {selectedQuestion.correct_answer}
              </p>
            </div>

            {/* Explanation */}
            {selectedQuestion.explanation && (
              <div>
                <p className="font-medium text-xs lg:text-base md:text-sm">Explanation:</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {selectedQuestion.explanation}
                </p>
              </div>
            )}

            {/* Explanation Image */}
            {selectedQuestion.explanation_img_url && (
              <div className="mt-2 w-full h-60 border border-dashed border-border rounded-md flex items-center justify-center bg-muted/20 overflow-hidden">
                <img
                  src={selectedQuestion.explanation_img_url}
                  alt="Explanation"
                  className="max-w-full max-h-full object-contain cursor-pointer"
                  onClick={() =>
                    window.open(selectedQuestion.explanation_img_url!, "_blank")
                  }
                />
              </div>
            )}

            {/* Date */}
            <div>
              <p className="font-medium text-xs lg:text-base md:text-sm">Added:</p>
              <p className="text-muted-foreground text-xs lg:text-base md:text-sm">
                {selectedQuestion.date_added}
              </p>
            </div>

            {/* Close */}
            <div className="flex justify-end">
              <Button
                text="Close"
                onClick={() => setViewOpen(false)}
                backgroundColor="bg-primary"
                textColor="text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
