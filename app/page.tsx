import Chip from "@/components/atoms/Chip";
import CountDownTimer from "@/components/atoms/CountDownTimer";
import Feedback from "@/components/atoms/Feedback";
import Footer from "@/components/atoms/Footer";
import { NavBar } from "@/lib/imports";
import { Eye } from "lucide-react";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <Feedback name={"Johnrey Lee"} date={"Feb 5, 2024"} rating={2} comment="Excellent app! Very helpful for exam prep."
  status="pending"/>
    </div>
  );
}
