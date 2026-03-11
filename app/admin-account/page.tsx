import { NavBar, AccountSettings } from "@/lib/client-imports"

const page = () => {
    const userInfo = {
        fullName: "Admin User",
        username: "adminuser",
        email: "cloyd@gmail.com",
        password: "securepassword"
    }

  return (
    <main>
        <NavBar State="LoggedIn"/>
        <AccountSettings userInfo={userInfo} role="admin" />
    </main>
  )
}

export default page