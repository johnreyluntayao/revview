import { Login, NavBar } from "@/lib/client-imports"

const page = () => {
  return (
    <main>
        <NavBar State="SignIn" />
        <Login />
    </main>
  )
}

export default page