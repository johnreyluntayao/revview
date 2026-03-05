import { QuizResult, NavBar } from "@/lib/client-imports";

const page = () => {
  return (
    <main>
        <NavBar State="Default" title="Quiz Results"/>
        <QuizResult />
    </main>
  )
}

export default page