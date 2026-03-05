import { SubmitFeedback, UserDashboard } from '@/lib/client-imports'

const page = () => {
  return (
    <main>
      <UserDashboard />
      <SubmitFeedback />
    </main>
  )
}

export default page