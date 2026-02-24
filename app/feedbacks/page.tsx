import { ManageFeedback, NavBar } from "@/lib/imports";

const page = () => {
  return (
    <main className="overflow-hidden">
        <NavBar State="LoggedIn"/>
        <ManageFeedback />
    </main>
  )
}

export default page