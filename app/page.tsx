import { Homepage, Footer, NavBar, Contact } from "@/lib/client-imports"

export default function Home() {


  return (
    <div className="w-full">
      <NavBar State="Home"/>
      <Homepage />
      <Contact />
      <Footer />
    </div>
  );
}
