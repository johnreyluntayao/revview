import { ManageQuestions, NavBar } from "@/lib/client-imports";

const page = () => {
  return (
    <main className="bg-primary/5 min-h-screen">
        <NavBar State="LoggedIn"/>
        <ManageQuestions />
    </main>
  )
}

export default page