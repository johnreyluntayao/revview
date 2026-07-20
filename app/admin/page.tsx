import { NavBar } from '@/lib/client-imports'
import { AdminDashboard } from '@/lib/server-imports'
import { requireAdmin } from "@/lib/auth-guards";

export default async function Page() {
  await requireAdmin();

  return (
    <main>
      <NavBar State="LoggedIn" />
      <AdminDashboard />
    </main>
  )
}
