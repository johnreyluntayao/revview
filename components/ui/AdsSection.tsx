'use client'
import React, { useEffect, useRef } from "react";

type AdVariant = "banner" | "card" | "sidebar" | "inline" | "native";

interface AdsSectionProps {
  variant?: AdVariant;
  keyId: string;           // This is the most important: your Adsterra 'key'
  width?: number;
  height?: number;
  format?: "iframe" | "js";
  className?: string;
}

const AdsSection: React.FC<AdsSectionProps> = ({
  variant = "banner",
  keyId,
  width,
  height,
  format = "iframe",
  className = "",
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!keyId || !adRef.current) return;

    // Prevent duplicate ads
    if (adRef.current.hasChildNodes()) return;

    try {
      const atOptions = {
        key: keyId,
        format: format,
        height: height || getDefaultHeight(variant),
        width: width || getDefaultWidth(variant),
        params: {},
      };

      // Create configuration script
      const conf = document.createElement("script");
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;

      // Create invoke script
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformancedformats.com/${keyId}/invoke.js`;

      // Append both
      adRef.current.appendChild(conf);
      adRef.current.appendChild(script);
    } catch (err) {
      console.error("Adsterra ad error:", err);
    }
  }, [keyId, variant, width, height, format]);

  if (!keyId) {
    return (
      <div className="text-red-500 text-sm p-4 border border-red-300 bg-red-50 rounded-lg">
        Adsterra keyId is missing
      </div>
    );
  }

  const getContainerClasses = () => {
    switch (variant) {
      case "banner":
        return "w-full my-6";
      case "card":
        return "w-full rounded-2xl overflow-hidden shadow-lg my-6 border border-gray-100";
      case "sidebar":
        return "w-[300px] mx-auto my-6";
      case "inline":
        return "my-4";
      case "native":
        return "w-full my-4";
      default:
        return "w-full my-6";
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div 
        ref={adRef}
        className={`adsterra-ad ${className}`.trim()}
        style={{
          width: "100%",
          minHeight: height || getDefaultHeight(variant),
          display: "block"
        }}
      />
    </div>
  );
};

// Helper functions
const getDefaultWidth = (variant: AdVariant): number => {
  switch (variant) {
    case "banner": return 728;
    case "card": return 300;
    case "sidebar": return 300;
    case "inline": return 320;
    case "native": return 300;
    default: return 728;
  }
};

const getDefaultHeight = (variant: AdVariant): number => {
  switch (variant) {
    case "banner": return 90;
    case "card": return 250;
    case "sidebar": return 600;
    case "inline": return 50;
    case "native": return 250;
    default: return 90;
  }
};

export default AdsSection;