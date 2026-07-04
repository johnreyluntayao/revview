import ProductList from "@/components/ui/ProductList";
import { Footer, NavBar } from "@/lib/client-imports";

const page = () => {
  return (
    <>
      <NavBar State="Default" title="Products to Power Your Progress" />
      <main className="min-h-screen">
        <ProductList />
      </main>
      <Footer />
    </>
  )
}

export default page
