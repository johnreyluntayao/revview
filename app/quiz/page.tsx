import { Quiz, NavBar } from "@/lib/client-imports";

const page = () => {
  return (
    <main>
      <NavBar State="OnQuiz" title="Category"/>
      <Quiz />
    </main>
  )
}

export default page