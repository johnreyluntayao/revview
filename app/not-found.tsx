import { Footer, NavBar } from "@/lib/client-imports";
import NotFoundContent from "@/components/ui/NotFoundContent";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar State="Default" title="Page not found" />
      <NotFoundContent />
      <Footer />
    </div>
  );
}
