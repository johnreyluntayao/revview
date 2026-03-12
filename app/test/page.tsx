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


const page = () => {

  return (
    <div>

      <ResultsHistory/>

    </div>
  )
}

export default page
