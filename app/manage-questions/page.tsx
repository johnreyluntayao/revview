import { ManageQuestions, NavBar } from "@/lib/client-imports";

const page = () => {
  return (
    <main>
        <NavBar State="LoggedIn"/>
        <ManageQuestions />
    </main>
  )
}

export default page