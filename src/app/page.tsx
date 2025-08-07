import HomePage from "@/components/layout/homepage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  return (
    <div>
      <HomePage />
    </div>
  );
}
