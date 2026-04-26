import { getServerSession } from "next-auth";
import SignInClient from "./SignInClient";
import { redirect } from "next/navigation";

export default async  function SignInPage() {
  const session = await getServerSession();
  if (session?.user) {
    redirect("/"); // Redirect to home if already signed in
  }

  return <SignInClient />;
}
