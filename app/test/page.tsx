"use client"
import AccountSettings from '@/components/AccountSettings'
import ComboBox from '@/components/atoms/ComboBox'
import ManageQuestion from '@/components/ManageQuestion'
import Quiz from '@/components/Quiz'
import Colors from '@/components/samples/Colors'
import { IconGallery } from '@/components/samples/Icons'
import AddEditQuestion from '@/components/ui/AddEditQuestion'
import DeletePopup from '@/components/ui/DeletePopup'
import ResultsHistory from '@/components/ResultsHistory'
import ScoreRecord from '@/components/ui/ScoreRecord'
import { Icon } from 'lucide-react'
import React, { useState } from 'react'
import {NavBar, PauseModal} from '@/lib/client-imports'



const page = () => {
  const [isPaused, setIsPaused] = useState(true);

  const handleRestartQuiz = () => {
    // Logic to restart the quiz
    setIsPaused(false);
  };

  const handleExitQuiz = () => {
    // Logic to exit the quiz and navigate to the home page
    setIsPaused(false);
  }

  return (
    <div>
      <PauseModal
        isOpen={isPaused}
        onClose={() => setIsPaused(false)}
        onRestart={handleRestartQuiz}
        onExit={handleExitQuiz}
      />

    </div>
  )
}

export default page
