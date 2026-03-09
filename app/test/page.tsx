import AccountSettings from '@/components/AccountSettings'
import ManageQuestion from '@/components/ManageQuestion'
import Quiz from '@/components/Quiz'
import Colors from '@/components/samples/Colors'
import { IconGallery } from '@/components/samples/Icons'
import AddEditQuestion from '@/components/ui/AddEditQuestion'
import DeletePopup from '@/components/ui/DeletePopup'
import ResultsHistory from '@/components/ui/ResultsHistory'
import ScoreRecord from '@/components/ui/ScoreRecord'
import { Icon } from 'lucide-react'
import React from 'react'

const page = () => {
  const user = {
    fullName: "Alice Wonderland",
    username: "alice_in_chains",
    email: "alice@example.com",
  };

const accountDetails = {
  createdAt: "March 12, 2025",
  lastLogin: "Today at 9:45 AM",
  status: "Active",           // ← or "Inactive", "Suspended", etc.
};
  return (
    <div>
      <AddEditQuestion/>
      <IconGallery/>
    </div>
  )
}

export default page