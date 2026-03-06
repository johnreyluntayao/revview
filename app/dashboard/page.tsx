import { SubmitFeedback } from '@/lib/client-imports'
import { UserDashboard } from '@/lib/server-imports'

const page = () => {
  return (
    <main>
      <UserDashboard />
      <SubmitFeedback />
    </main>
  )
}

export default page