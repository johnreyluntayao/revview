import LearnerShell from "@/components/ui/LearnerShell";
import { requireUser } from "@/lib/auth-guards";

export default async function ResultsHistoryLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <LearnerShell>{children}</LearnerShell>;
}
