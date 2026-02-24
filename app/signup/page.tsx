import { SignUp, NavBar } from "@/lib/imports";

const page = () => {
  return (
    <main>
        <NavBar State="SignUp" />
        <SignUp />
    </main>
  )
}

export default page