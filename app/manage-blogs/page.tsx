import BlogManagement from "@/components/BlogManagement";
import { NavBar } from "@/lib/client-imports";

export default function ManageBlogsPage() {
  return (
    <>
      <NavBar State="LoggedIn" />
      <BlogManagement />
    </>
  );
}
