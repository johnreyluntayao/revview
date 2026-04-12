import { Homepage, Footer, NavBar} from "@/lib/client-imports"

export default function Home() {


  return (
    <div className="w-full">
      <NavBar State="Home"/>
      <Homepage />

      <Footer />
    </div>
  );
}
