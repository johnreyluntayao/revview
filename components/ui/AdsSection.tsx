'use client'
import React, { useEffect } from "react";

type AdVariant = "banner" | "card" | "sidebar" | "inline";

interface AdsSectionProps {
  variant?: AdVariant;
  slot: string;           // Required
  format?: string;
  className?: string;
}

// Declare adsbygoogle on Window (TypeScript fix)
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdsSection: React.FC<AdsSectionProps> = ({
  variant = "banner",
  slot,
  format = "auto",
  className = "",
}) => {
  useEffect(() => {
    try {
      // This is the standard way to push AdSense ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [slot]);

  const adProps = {
    className: `adsbygoogle ${className}`.trim(),
    style: { display: "block" } as React.CSSProperties,
    "data-ad-client": "ca-pub-4571981118354444",
    "data-ad-slot": slot,
    "data-ad-format": format,
    "data-full-width-responsive": "true",
  };

  // BANNER
  if (variant === "banner") {
    return (
      <div className="w-full my-6">
        <ins
          {...adProps}
          data-ad-format="auto"
          style={{ display: "block", width: "100%", minHeight: "100px" }}
        />
      </div>
    );
  }

  // CARD
  if (variant === "card") {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-md my-4">
        <ins
          {...adProps}
          data-ad-format="rectangle"
          style={{ display: "block", width: "100%", minHeight: "280px" }}
        />
      </div>
    );
  }

  // SIDEBAR
  if (variant === "sidebar") {
    return (
      <div className="w-64 mx-auto my-4">
        <ins
          {...adProps}
          data-ad-format="vertical"
          style={{ display: "block", width: "100%", minHeight: "300px" }}
        />
      </div>
    );
  }

  // INLINE
  if (variant === "inline") {
    return (
      <div className="my-4">
        <ins
          {...adProps}
          data-ad-format="fluid"
          style={{ display: "block", width: "100%", minHeight: "80px" }}
        />
      </div>
    );
  }

  return null;
};

export default AdsSection;