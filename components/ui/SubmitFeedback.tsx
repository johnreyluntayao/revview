"use client";

import { useCallback, useState } from "react";
import { FeedbackIcon, SendFeedback, Feedback } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import { Button, InputField, Modal } from "@/lib/client-imports";
import { toast } from "sonner";

export default function SubmitFeedback() {
  const [supabase] = useState(() => createClient());
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = useCallback(() => {
    if (!isSubmitting) setShowFeedbackModal(false);
  }, [isSubmitting]);

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0 || isSubmitting) {
      toast.error("Please select a rating", {
        description: "Choose at least one star before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Please sign in again to submit feedback.");

      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        rating: feedbackRating,
        comment: feedbackText.trim() || null,
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!", {
        description: "We received your comments and appreciate your help.",
      });
      setShowFeedbackModal(false);
      setFeedbackRating(0);
      setFeedbackHoverRating(0);
      setFeedbackText("");
    } catch (error: unknown) {
      console.error("Feedback submission failed:", error);
      toast.error("Failed to send feedback", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex size-13 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 sm:size-14"
        aria-label="Send feedback"
        title="Send feedback"
        type="button"
      >
        <FeedbackIcon className="size-6" />
      </button>

      <Modal
        isOpen={showFeedbackModal}
        onClose={closeModal}
        title="Send us feedback"
        description="Help us improve your learning experience."
        size="sm"
        closeOnBackdrop={!isSubmitting}
        contentClassName="p-4 sm:p-6"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              text="Cancel"
              onClick={closeModal}
              isDisabled={isSubmitting}
              borderColor="border-border"
              className="w-full sm:w-auto"
            />
            <Button
              text={isSubmitting ? "Sending…" : "Submit feedback"}
              leftIcon={<SendFeedback className="size-4" />}
              onClick={handleSubmitFeedback}
              isDisabled={feedbackRating === 0 || isSubmitting}
              backgroundColor="bg-primary"
              textColor="text-primary-foreground"
              className="w-full sm:w-auto"
            />
          </div>
        }
      >
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">Rate your experience</legend>
            <div className="mt-3 flex justify-center gap-2" role="radiogroup" aria-label="Experience rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  aria-pressed={feedbackRating === star}
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  onMouseEnter={() => setFeedbackHoverRating(star)}
                  onMouseLeave={() => setFeedbackHoverRating(0)}
                  className="rounded-lg p-1.5 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Feedback
                    className={`size-8 ${
                      star <= (feedbackHoverRating || feedbackRating)
                        ? "fill-warning text-warning"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <InputField
            label={<>Comments <span className="font-normal text-muted-foreground">(optional)</span></>}
            type="textarea"
            placeholder="Tell us what you think…"
            value={feedbackText}
            maxLength={1000}
            onChange={(event) => setFeedbackText(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
