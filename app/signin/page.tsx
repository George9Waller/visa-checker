import { getServerSession } from "next-auth";
import SignInClient from "./SignInClient";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function SignInPage() {
  const locale = await getLocale();
  const session = await getServerSession();
  if (session?.user) {
    redirect({ href: "/", locale });
  }

  return <SignInClient />;
}
