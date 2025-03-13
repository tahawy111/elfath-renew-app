import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/login");
  return <div>{children}</div>;
}

export default MainLayout;
