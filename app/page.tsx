import CountDownTimer from "@/components/atoms/CountDownTimer";
import { NavBar } from "@/lib/imports";
import { Eye } from "lucide-react";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <CountDownTimer
  minutes={0}
  seconds={4}
/>
    </div>
  );
}
