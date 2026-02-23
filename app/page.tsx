import Card from "@/components/atoms/Card";
import Chip from "@/components/atoms/Chip";
import CountDownTimer from "@/components/atoms/CountDownTimer";
import Feedback from "@/components/atoms/Feedback";
import Footer from "@/components/atoms/Footer";
import Progress from "@/components/atoms/Progress";
import { NavBar } from "@/lib/imports";
import { Car, Eye } from "lucide-react";

import { Users, UserCheck, BookOpen, BarChart2, Trophy, Clock } from "lucide-react";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">

   <Progress 
   variant="percent"
   label="Lulu"
   percentage={89}
   
   />
</div>
  );
}
