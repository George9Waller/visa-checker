"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Btn } from "../design";

export function SignInButton({ name, id }: { name: string; id: string }) {
  const t = useTranslations("signin");

  return (
    <div
      onClick={() => {
        signIn(id);
      }}
    >
      <Btn
        as="button"
        // href={provider.signinUrl}
        variant="primary"
        size="md"
        className="w-full justify-center"
      >
        {t("signInWith", { provider: name })}
      </Btn>
    </div>
  );
}
