import { Btn, PageContainer, Stack, Text } from "@/app/design";

export default function SignInClient() {
  return (
    <PageContainer>
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center">
        <Stack className="gap-5 rounded-lg border border-border bg-bg-raised p-6 shadow-sm">
          <Stack className="gap-2">
            <Text className="text-sm uppercase tracking-[0.2em] text-fg-muted">
              Visa checker
            </Text>
            <Text className="text-3xl font-semibold">Sign in</Text>
            <Text className="text-sm text-fg-muted">
              Google sign-in can be blocked by local OAuth security checks. Use the
              dev account for local browser auditing.
            </Text>
          </Stack>

          <Stack className="gap-3">
            <form action="/api/dev-login" method="post">
              <Btn variant="primary" type="submit" className="w-full justify-center">
                Sign in as Dev User
              </Btn>
            </form>
            <Btn
              as="a"
              href="/api/auth/signin/google?callbackUrl=/"
              variant="outline"
              className="w-full justify-center"
            >
              Continue with Google
            </Btn>
          </Stack>
        </Stack>
      </div>
    </PageContainer>
  );
}
