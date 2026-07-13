import type { Metadata } from "next";
import ProductList from "@/components/ui/ProductList";
import { Footer, NavBar } from "@/lib/client-imports";

export const metadata: Metadata = {
  title: "Review Products & Learning Resources",
  description:
    "Browse RevView's curated learning products, reviewers, and preparation resources to support your exam study plan.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    url: "/products",
    title: "Review Products & Learning Resources | RevView",
    description:
      "Find curated products and study resources that can help boost your preparation.",
  },
};

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
