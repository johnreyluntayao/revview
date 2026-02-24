import { NavBar, AdminDashboard } from '@/lib/imports'

const page = () => {

  return (
    <main className=''>
    <NavBar State='LoggedIn'/>
    <AdminDashboard admin="Admin" />
    </main>
  )
}

export default page