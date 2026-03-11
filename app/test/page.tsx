"use client"
import AccountSettings from '@/components/AccountSettings'
import ComboBox from '@/components/atoms/ComboBox'
import ManageQuestion from '@/components/ManageQuestion'
import Quiz from '@/components/Quiz'
import Colors from '@/components/samples/Colors'
import { IconGallery } from '@/components/samples/Icons'
import AddEditQuestion from '@/components/ui/AddEditQuestion'
import DeletePopup from '@/components/ui/DeletePopup'
import ResultsHistory from '@/components/ui/ResultsHistory'
import ScoreRecord from '@/components/ui/ScoreRecord'
import { Icon } from 'lucide-react'
import React, { useState } from 'react'


const page = () => {
  const mockUser = {
  fullName: "John Cloyd Refani",
  username: "cloydy",
  email: "jhnrefani@gmail.com",
  password: "********", // you might leave password hidden by default
};

  return (
    <div>
      <ManageQuestion/>
      
    </div>
  )
}

export default page
