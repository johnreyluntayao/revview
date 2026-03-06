import { NavBar } from '@/lib/client-imports'
import { AdminDashboard } from '@/lib/server-imports'

export default function Page() {
  return (
    <main>
      <NavBar State="LoggedIn" />
      <AdminDashboard />
    </main>
  )
}