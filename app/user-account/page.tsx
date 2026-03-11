import { AccountSettings } from "@/lib/client-imports"

const page = () => {
    const userInfo = {
        fullName: "Admin User",
        username: "adminuser",
        email: "cloyd@gmail.com",
        password: "securepassword"
    }

  return (
    <main>
        <AccountSettings userInfo={userInfo} role="user" />
    </main>
  )
}

export default page