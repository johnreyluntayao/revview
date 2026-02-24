import { Login, NavBar } from "@/lib/imports"

const page = () => {
  return (
    <main>
        <NavBar State="SignIn" />
        <Login />
    </main>
  )
}

export default page