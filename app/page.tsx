import AdsSection from "@/components/ui/AdsSection";
import AffiliateManagement from "@/components/ui/AffiliateManagement";
import { Homepage, Footer, NavBar} from "@/lib/client-imports"

export default function Home() {


  return (
    <div className="w-full">
      <NavBar State="Home"/>
      <Homepage />
      <Footer />
      <AdsSection variant="inline"/>
      <AffiliateManagement/>
    </div>
  );
}
