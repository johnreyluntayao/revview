import BlogManagement from "@/components/BlogManagement";
import { NavBar } from "@/lib/client-imports";
import { requireAdmin } from "@/lib/auth-guards";

export default async function ManageBlogsPage() {
  await requireAdmin();

  return (
    <>
      <NavBar State="LoggedIn" />
      <BlogManagement />
    </>
  );
}
