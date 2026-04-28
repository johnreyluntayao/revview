'use client'
import React from "react";

type AdVariant = "banner" | "card" | "sidebar" | "inline";

interface AdsSectionProps {
  variant?: AdVariant;
  title?: string;
  description?: string;
  image?: string;
  cta?: string;
  link?: string;
}

const AdsSection: React.FC<AdsSectionProps> = ({
  variant = "banner",
  title = "Your Ad Here",
  description = "Promote your product or service with high visibility.",
  image = "https://via.placeholder.com/600x300",
  cta = "Learn More",
  link = "#",
}) => {
  const handleClick = () => {
    if (link) {
      window.location.href = link;
    }
  };

  // BANNER
  if (variant === "banner") {
    return (
      <div className="w-full bg-linear-to-r from-primary to-secondary text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          <p className="text-sm opacity-90">{description}</p>
        </div>
        <button
          onClick={handleClick}
          className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          {cta}
        </button>
      </div>
    );
  }

  // CARD
  if (variant === "card") {
    return (
      <div className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
        <img src={image} alt="ad" className="w-full h-30 object-cover" />
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <button
            onClick={handleClick}
            className="mt-2 bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            {cta}
          </button>
        </div>
      </div>
    );
  }

  // SIDEBAR
  if (variant === "sidebar") {
    return (
      <div className="w-64 bg-gray-100 rounded-2xl p-4 flex flex-col gap-3">
        <img src={image} alt="ad" className="w-full h-32 object-cover rounded-lg" />
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <button
          onClick={handleClick}
          className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {cta}
        </button>
      </div>
    );
  }

  // INLINE
  if (variant === "inline") {
    return (
      <div className="w-full bg-yellow-100 border border-yellow-300 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <button
          onClick={handleClick}
          className="text-xs bg-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
        >
          {cta}
        </button>
      </div>
    );
  }

  return null;
};

export default AdsSection;