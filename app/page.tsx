import { Homepage, NavBar, Contact, Footer } from "@/lib/imports";

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
