import AdsSection from "@/components/ui/AdsSection";
import { Homepage, Footer, NavBar } from "@/lib/client-imports";

export default function Home() {
  return (
    <div className="w-full">
      {/* <AdsSection variant="inline" keyId="29453451" /> */}
      <NavBar State="Home" />
      <Homepage />
      <Footer />
      {/* <AdsSection variant="inline" keyId="29453454" /> */}
    </div>
  );
}
