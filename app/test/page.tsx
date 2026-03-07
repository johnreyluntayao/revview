import ManageQuestion from '@/components/ManageQuestion'
import Colors from '@/components/samples/Colors'
import { IconGallery } from '@/components/samples/Icons'
import AddEditQuestion from '@/components/ui/AddEditQuestion'
import DeletePopup from '@/components/ui/DeletePopup'
import ScoreRecord from '@/components/ui/ScoreRecord'
import React from 'react'

const page = () => {
  return (
    <div>
        <ScoreRecord
  title="Numerical Ability"
  difficulty="Medium"
  score={20}
  items={20}
  time="18:45"
  date="Feb 3, 2024"
/>
    </div>
  )
}

export default page