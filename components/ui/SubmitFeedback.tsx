"use client";

import { useState } from "react";
import { FeedbackIcon, SendFeedback, Feedback } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client"; 

import { Button, InputField } from "@/lib/imports"; 

interface SubmitFeedbackProps {
  
}

export default function SubmitFeedback({}: SubmitFeedbackProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feedback").insert({
        rating: feedbackRating,
        comment: feedbackText.trim() || null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      setFeedbackSubmitted(true);

      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackRating(0);
        setFeedbackText("");
        setFeedbackSubmitted(false);
      }, 2200);
    } catch (err) {
      console.error("Feedback submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-30"
        title="Send feedback"
        type="button"
      >
        <FeedbackIcon className="w-7 h-7" />
      </button>

      {/* Feedback Modal Overlay */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={() => setShowFeedbackModal(false)}
        >
          {/* Modal Card */}
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FeedbackIcon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Send Us Feedback</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Help us improve your learning experience
              </p>
            </div>

            {feedbackSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Thank You!
                </h3>
                <p className="text-muted-foreground">
                  Your feedback has been received.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Rate your experience
                  </label>
                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        aria-label="rate"
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        onMouseEnter={() => setFeedbackHoverRating(star)}
                        onMouseLeave={() => setFeedbackHoverRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Feedback
                          className={`w-8 h-8 ${
                            star <= (feedbackHoverRating || feedbackRating)
                              ? "fill-warning text-warning"
                              : "text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Field – using your InputField (multiline) */}
                <div>
                  <InputField
                    label={
                      <>
                        Comments{" "}
                        <span className="text-muted-foreground font-normal">
                          (Optional)
                        </span>
                      </>
                    }
                    placeholder="Tell us what you think..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                  <Button
                    text="Cancel"
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 border border-border  "
                    textColor="text-foreground"
                    backgroundColor="hover:bg-muted"
                  />

                  <Button
                    text={isSubmitting ? "Sending..." : "Submit"}
                    leftIcon={<SendFeedback className="w-4 h-4" />}
                    onClick={handleSubmitFeedback}
                    isDisabled={feedbackRating === 0 || isSubmitting}
                    backgroundColor="bg-primary"
                    textColor="text-primary-foreground"
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}