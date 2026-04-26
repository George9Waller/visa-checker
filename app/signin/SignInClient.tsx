import { useTranslations } from "next-intl";
import { Btn, PageContainer, Stack, Text } from "@/app/design";

export default function SignInClient() {
  const t = useTranslations("signin");
  return (
    <PageContainer>
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center">
        <Stack className="gap-5 rounded-lg border border-border bg-bg-raised p-6 shadow-sm">
          <Stack className="gap-2">
            <Text className="text-sm uppercase tracking-[0.2em] text-fg-muted">
              {t("brand")}
            </Text>
            <Text className="text-3xl font-semibold">{t("title")}</Text>
            <Text className="text-sm text-fg-muted">
              {t("subtitle")}
            </Text>
          </Stack>

          <Stack className="gap-3">
            <form action="/api/dev-login" method="post">
              <Btn variant="primary" type="submit" className="w-full justify-center">
                {t("devSignIn")}
              </Btn>
            </form>
            <Btn
              as="a"
              href="/api/auth/signin/google?callbackUrl=/"
              variant="outline"
              className="w-full justify-center"
            >
              {t("continueWithGoogle")}
            </Btn>
          </Stack>
        </Stack>
      </div>
    </PageContainer>
  );
}
