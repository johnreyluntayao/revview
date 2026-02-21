import Chip from "@/components/atoms/Chip";
import CountDownTimer from "@/components/atoms/CountDownTimer";
import Feedback from "@/components/atoms/Feedback";
import Footer from "@/components/atoms/Footer";
import Progress from "@/components/atoms/Progress";
import { NavBar } from "@/lib/imports";
import { Eye } from "lucide-react";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center font-sans">

      <Progress variant="default" current={1} total={5} label="Question" />

      <Progress variant="percent" percentage={75} label="Numerical Ability" />

      <Progress
        variant="milestone"
        current={12}
        label="Tests"
        subLabel="12 tests completed"
      />
    </div>
  );
}
