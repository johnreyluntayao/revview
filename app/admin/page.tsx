import { NavBar } from '@/lib/imports'
import AdminDashboard from '@/components/AdminDashboard'

export default function Page() {
  return (
    <main>
      <NavBar State="LoggedIn" />
      <AdminDashboard />
    </main>
  )
}