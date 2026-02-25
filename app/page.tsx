"use client"
import RadioButton from "@/components/atoms/RadioButton";
import { BookOpen } from "lucide-react";
import React from "react";


export default function Home() {
  const [selected, setSelected] = React.useState<string | number | null>(null);

  return (
    <div className="space-y-3 w-full max-w-lg">
      {/* pill – no icon, soft corners */}
      <RadioButton
        variant="pill"
        value="easy"
        label="Easy"
        isSelected={selected === "easy"}
        onSelect={setSelected}
      />

      {/* card – no icon, indicator on right */}
      <RadioButton
        variant="card"
        value="medium"
        label="Medium"
        description="7 minutes per question"
        isSelected={selected === "medium"}
        onSelect={setSelected}
      />

      {/* boxed – icon kept, indicator on right */}
      <RadioButton
        variant="boxed"
        value="D"
        label="General Information"
        description="Constitution, rights, code of conduct"
        icon="📜"
        isSelected={selected === "D"}
        onSelect={setSelected}
      />

      {/* choice – label inside rounded square, indicator on left */}
      <RadioButton
        variant="choice"
        value="A"
        label="A"
        isSelected={selected === "A"}
        onSelect={setSelected}
      />

      <RadioButton
        variant="choice"
        value="B"
        label="Bitch"
        isSelected={selected === "B"}
        onSelect={setSelected}
        
      />
    </div>
  );
}
