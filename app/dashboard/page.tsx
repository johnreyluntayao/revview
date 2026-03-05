import { SubmitFeedback, UserDashboard } from '@/lib/imports'

const page = () => {
  return (
    <main>
      <UserDashboard />
      <SubmitFeedback />
    </main>
  )
}

export default page