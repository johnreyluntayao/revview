"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Add, Delete, Edit, Search, Image as ImageIcon } from "@/lib/icons";
import { Button, Chip, ComboBox, InputField, AddEditQuestion, DeletePopup } from "@/lib/client-imports"; // assuming AddEditQuestion & DeletePopup are here too
import { createClient } from "@/lib/supabase/client";

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
  date_added: string; // formatted
};

export default function ManageQuestions() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState("All Time");

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
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

const getDateRange = (filter: string): { from: string | null; to: string | null } => {
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

    let query = supabase
      .from("questions")
      .select(`
        id, text, img_url, category_id, options, option_images, correct_answer,
        explanation, explanation_img_url, date_added,
        categories!inner (name)
      `)
      .order("date_added", { ascending: false });

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

    const { data, error } = await query;

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
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [searchTerm, selectedCategoryId, selectedTime]);

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
    const parts = u.pathname.split("/storage/v1/object/public/revview-files/");
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

    setQuestions(prev => prev.filter(q => q.id !== deleteId));
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


      if (
        editQuestion.img_url &&
        editQuestion.img_url !== payload.img_url
      ) {
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

      // option images
      payload.option_images.forEach((newImg: string | null, i: number) => {
        const oldImg = editQuestion.option_images?.[i];

        if (oldImg && oldImg !== newImg) {
          const p = extractPath(oldImg);
          if (p) pathsToDelete.push(p);
        }
      });


      if (pathsToDelete.length > 0) {
        await supabase.storage
          .from("revview-files")
          .remove(pathsToDelete);
      }

      const { error } = await supabase
        .from("questions")
        .update(payload)
        .eq("id", editQuestion.id);

      if (error) throw error;

      toast.success("Question updated");

    } else {

      const { error } = await supabase
        .from("questions")
        .insert([payload]);

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

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-20 lg:py-24">
      <div className="gap-4 md:gap-6 lg:gap-8 flex flex-col">
        <div className="">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          Manage Questions
        </h1>
        <p className="text-xs md:text-sm lg:text-base text-foreground/70">
          Add, Edit, and Delete your quiz questions here. Use the filters to find specific questions or view all of them.
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
              options={[{ value: "all", label: "All Categories" }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
              isSearchable={false}
            />
          </div>

          <div className="w-auto col-span-1">
            <ComboBox
             label="Date Added"
              placeholder="All Time"
              options={timeOptions.map(t => ({ value: t, label: t }))}
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
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No questions found</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
            <div className="grid grid-cols-[3fr_1fr_100px_1fr_120px] divide-y divide-border">
              <div className="contents text-xs md:text-sm lg:text-base">
                <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">Question</div>
                <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">Category</div>
                <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">Answer</div>
                <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">Added</div>
                <div className="bg-muted/40 font-semibold text-foreground px-5 flex text-left items-center">Actions</div>
              </div>

              {questions.map(q => (
                <div key={q.id} className="contents group hover:bg-muted/20 transition-colors">
                  <div className="py-4 px-5 text-sm text-foreground flex items-center gap-2 line-clamp-2">
                    {q.text || "Image only"}
                    {(q.img_url || q.explanation_img_url) && (
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80"
                        title="View image(s)"
                        onClick={() => {
                          const url = q.img_url || q.explanation_img_url;
                          if (url) window.open(url, "_blank");
                        }}
                      >
                        <ImageIcon size={16} />
                      </button>
                    )}
                  </div>
                  <div className="py-4 px-5 flex items-center">
                    <Chip text={q.category_name} variant={q.category_name.toLowerCase() as any} />
                  </div>
                  <div className="py-4 px-5 text-center text-sm font-semibold text-primary flex items-center justify-center">
                    {q.correct_answer}
                  </div>
                  <div className="py-4 px-5 text-sm text-muted-foreground flex items-center">
                    {q.date_added}
                  </div>
                  <div className="py-4 px-5 flex items-center justify-end gap-2">
                    <Button
                      leftIcon={<Edit size={16} />}
                      backgroundColor="bg-primary/25"
                      textColor="text-primary"
                      onClick={() => handleEdit(q)}
                    />
                    <Button
                      leftIcon={<Delete size={16} />}
                      backgroundColor="bg-destructive/25"
                      textColor="text-destructive"
                      onClick={() => handleDeleteClick(q.id, q.text)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
    </div>
  );
}