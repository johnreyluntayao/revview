import { SignUp, NavBar } from "@/lib/client-imports";

const page = () => {
  return (
    <main>
        <NavBar State="SignUp" />
        <SignUp />
    </main>
  )
}

export default page