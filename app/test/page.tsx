import ManageQuestion from '@/components/ManageQuestion'
import AddEditQuestion from '@/components/ui/AddEditQuestion'
import DeletePopup from '@/components/ui/DeletePopup'
import React from 'react'

const page = () => {
  return (
    <div>
        <AddEditQuestion isEdit={true}/>
    </div>
  )
}

export default page