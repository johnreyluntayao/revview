import ManageQuestion from '@/components/ManageQuestion'
import Quiz from '@/components/Quiz'
import Colors from '@/components/samples/Colors'
import { IconGallery } from '@/components/samples/Icons'
import AddEditQuestion from '@/components/ui/AddEditQuestion'
import DeletePopup from '@/components/ui/DeletePopup'
import ResultsHistory from '@/components/ui/ResultsHistory'
import ScoreRecord from '@/components/ui/ScoreRecord'
import React from 'react'

const page = () => {
  return (
    <div>
      <Quiz/>
    </div>
  )
}

export default page