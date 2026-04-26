"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Btn } from "../design";

export function SignInButton({
  name,
  id,
  callbackUrl,
}: {
  name: string;
  id: string;
  callbackUrl: string;
}) {
  const t = useTranslations("signin");

  return (
    <Btn
      variant="primary"
      size="md"
      className="w-full justify-center"
      onClick={() => {
        void signIn(id, { callbackUrl });
      }}
    >
      {t("signInWith", { provider: name })}
    </Btn>
  );
}
