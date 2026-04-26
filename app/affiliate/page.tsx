import { AdminAffiliate } from "@/lib/client-imports" 
import { NavBar } from '@/lib/client-imports'

const page = () => {
  return (
    <main>
        <NavBar State="LoggedIn" />
        <AdminAffiliate />
    </main>
  )
}

export default page