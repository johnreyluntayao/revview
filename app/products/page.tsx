import ProductList from "@/components/ui/ProductList";
import { Footer, NavBar } from "@/lib/client-imports";

const page = () => {
  return (
    <>
      <NavBar State="Default" />
      <main className="min-h-screen pt-16 lg:pt-20">
        <ProductList />
      </main>
      <Footer />
    </>
  )
}

export default page
