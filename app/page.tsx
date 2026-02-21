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

      {/* <Card
        variant="overview"
        title="Overall Score"
        value="75.2%"
        subValue="Based on 45 completed quizzes"
        bg="bg-white"
        textColor="text-red-500"
      /> */}
      {/* <Card
        variant="highlight"
        title="Overall Score"
        value="75.2%"
        subValue="Based on 45 completed quizzes"
        icon={<BarChart2 size={48} />}
        iconColor="text-indigo-600"
        bg="bg-blue-50"
      /> */}

      {/* <Card
        variant="stat"
        title="Avg Score"
        value="75.2%"
        subValue="Across users"
        icon={<BarChart2 size={24} />}
        iconColor="text-indigo-600"
        bg="bg-white"
        trend="up"
      /> */}

      <Card
        variant="compact"
        title="Avg Score"
        value="75.2%"
        subValue="Across users"
        icon={<BarChart2 size={24} />}
        iconColor="text-indigo-600"
        bg="bg-white"/>
    </div>
  );
}
