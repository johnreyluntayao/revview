"use client"

import { useState } from "react";
import { Feedback, Button } from "@/lib/imports";

interface FeedbackType {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  resolved: boolean;
}

const ManageFeedbacks = () => {
  const feedbackList: FeedbackType[] = [
    {
      id: 1,
      userId: "user123",
      userName: "John Doe",
      rating: 5,
      comment: "Excellent app! Very helpful for exam prep.",
      date: "Feb 5, 2024",
      resolved: false,
    },
    {
      id: 2,
      userId: "user456",
      userName: "Jane Smith",
      rating: 4,
      comment: "Great questions but needs more explanation.",
      date: "Feb 4, 2024",
      resolved: false,
    },
    {
      id: 3,
      userId: "user789",
      userName: "Mike Johnson",
      rating: 3,
      comment: "Timer runs too fast",
      date: "Feb 3, 2024",
      resolved: true,
    },
    {
      id: 4,
      userId: "user101",
      userName: "Sarah Williams",
      rating: 5,
      comment: "Love the interface and difficulty levels!",
      date: "Feb 2, 2024",
      resolved: false,
    },
    {
      id: 5,
      userId: "user202",
      userName: "Robert Brown",
      rating: 2,
      comment: "Some questions are unclear",
      date: "Feb 1, 2024",
      resolved: true,
    },
  ];

  const [filter, setFilter] = useState<"all" | "resolved" | "pending">("all");

  const filteredFeedbacks = feedbackList.filter((fb) => {
    if (filter === "all") return true;
    if (filter === "resolved") return fb.resolved === true;
    if (filter === "pending") return fb.resolved === false;
    return true;
  });

  return (
    <main className="p-4 md:p-6 lg:p-8 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Manage Feedbacks</h1>
      <p className="text-sm md:text-base font-medium lg:text-lg text-muted-foreground mt-1 md:mt-2 lg:mt-3">
        Here's the overview of feedbacks.
      </p>

      <div className="flex border border-border bg-white p-4 md:p-5 lg:p-6 rounded-xl gap-1 md:gap-2 lg:gap-3 mt-4 md:mt-6 lg:mt-8">
        <Button
            text="All"
            textColor={filter === "all" ? "text-white" : "text-foreground"}
            backgroundColor={filter === "all" ? "bg-primary" : "bg-muted-foreground/30"}
            onClick={() => setFilter("all")}
        />
        <Button
          text="Resolved"
          textColor={filter === "resolved" ? "text-white" : "text-foreground"}
          backgroundColor={filter === "resolved" ? "bg-primary" : "bg-muted-foreground/30"}
          onClick={() => setFilter("resolved")}
        />
        <Button
          text="Unresolved"
          textColor={filter === "pending" ? "text-white" : "text-foreground"}
          backgroundColor={filter === "pending" ? "bg-primary" : "bg-muted-foreground/30"}
          onClick={() => setFilter("pending")}
        />
      </div>

      <div className="mt-4 md:mt-6 lg:mt-8 grid grid-cols-1 gap-3 md:gap-4 lg:gap-5">
        {filteredFeedbacks.map((feedback) => (
          <Feedback
            key={feedback.id}
            name={feedback.userName}
            date={feedback.date}
            rating={feedback.rating}
            comment={feedback.comment}
            status={feedback.resolved ? "resolved" : "pending"}
          />
        ))}
      </div>
    </main>
  );
};

export default ManageFeedbacks;