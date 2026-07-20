import { ImageResponse } from "next/og";

export const alt = "RevView exam preparation platform";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 48%, #2563eb 100%)",
          color: "white",
          padding: "78px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.16)",
              border: "1px solid rgba(255, 255, 255, 0.28)",
            }}
          >
            R
          </div>
          RevView
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              alignSelf: "flex-start",
              borderRadius: 999,
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.14)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Civil Service Exam Review
          </div>
          <h1
            style={{
              margin: 0,
              maxWidth: 900,
              fontSize: 74,
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              fontWeight: 900,
            }}
          >
            Practice smarter. Track progress. Prepare with confidence.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 760,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(255, 255, 255, 0.82)",
            }}
          >
            Quizzes, explanations, performance insights, and curated learning
            resources in one focused review platform.
          </p>
        </div>
      </div>
    ),
    size
  );
}
