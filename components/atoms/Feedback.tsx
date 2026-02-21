// components/Feedback.tsx  (or wherever you prefer to place it)

import { Star } from "lucide-react"; // optional: nice star icons
// If you don't want lucide-react, see plain text ★ version at the bottom

interface Feedbackprops {
  name: string;
  date: string;
  rating: number;
  comment: string;
  status?: "resolved" | "pending";
}

const Feedback: React.FC<Feedbackprops> = ({
  name,
  date,
  rating,
  comment,
  status = "pending", // default to pending
}) => {
  return (
    <div className="bg-white border-2 border-blue-300  rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Name + Date + Rating Stars */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-black">
            {name}
          </h3>
          <p className="text-sm text-black/50">
            {date}
          </p>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={20}
              className={
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400 "
              }
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-black/80 leading-relaxed mb-6">
        {comment}
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          className={`
            px-4 py-2 rounded-md font-medium text-white transition-colors
            ${
              status === "resolved"
                ? "bg-green-700 cursor-not-allowed opacity-70"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
          disabled={status === "resolved"}
        >
          {status === "resolved" ? "Resolved" : "Mark Resolved"}
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Feedback;