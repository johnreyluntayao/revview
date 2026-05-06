import AdsSection from "@/components/ui/AdsSection";
import { Homepage, Footer, NavBar} from "@/lib/client-imports"

export default function Home() {


  return (
    <div className="w-full">
      <NavBar State="Home"/>
      <Homepage />
      <Footer />
      <AdsSection variant="inline" slot="2728166929"/>
    </div>
  );
}
