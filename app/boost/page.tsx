import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guards";

export default async function LegacyBoostPage() {
  await requireAdmin();
  redirect("/affiliate");
}
