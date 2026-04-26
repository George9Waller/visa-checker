import { getTranslations } from "next-intl/server";
import { getProviders } from "next-auth/react";
import { cn } from "@/app/design/cn";
import { Stack, Text } from "@/app/design";
import { APP_ESTABLISHED_YEAR, APP_NAME } from "../constants";
import { SignInButton } from "./SignInButton";

export default async function SignInClient() {
  const [providers, t] = await Promise.all([
    getProviders(),
    getTranslations("signin"),
  ]);
  const authProviders = providers
    ? Object.values(providers).filter(
        (provider) => provider.id !== "credentials"
      )
    : [];

  return (
    <div className="relative min-h-screen flex flex-col bg-bg text-fg pb-45">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.55]"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
        style={{ zIndex: 0 }}
      >
        <path
          d="M32 0H0V32"
          stroke="var(--color-fg)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.07"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <pattern
            id="grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 0H0V32"
              stroke="var(--color-fg)"
              strokeWidth="0.5"
              fill="none"
              opacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <header className="relative z-10 flex flex-col gap-0 px-[22px] pt-5">
        <div className="flex justify-between font-mono text-[11px] tracking-[0.22em] opacity-70">
          <Text>{APP_NAME}</Text>
          <span className="opacity-55">
            {t("established", { year: APP_ESTABLISHED_YEAR })}
          </span>
        </div>
        <div className="mt-[10px] h-px bg-fg opacity-85" />
        <div className="mt-[3px] h-px bg-fg opacity-18" />
      </header>

      <section className="relative z-10 px-[22px] pt-7">
        <div className="mb-[14px] font-mono text-[11px] tracking-[0.28em] opacity-60">
          {t("kicker")}
        </div>
        <h1 className="font-display text-[clamp(54px,14vw,72px)] leading-[0.92] tracking-[-0.025em] mb-0">
          {t("headlinePart1")}
          <br />
          <em className="not-italic opacity-85">{t("headlinePart2")}</em>
          <br />
          {t("headlinePart3")}
        </h1>
        <p className="mt-[22px] max-w-[360px] font-body text-[15.5px] leading-[1.55] text-fg-muted">
          {t("body")}
        </p>
      </section>

      <section className="relative z-10 mx-[22px] mt-[26px] grid grid-cols-3 border-b border-fg/25 border-t border-fg">
        <div className="border-r border-fg/22 px-3 py-[14px]">
          <div className="mb-2 font-mono text-[10px] tracking-[0.24em] opacity-50">
            01
          </div>
          <div className="mb-1 font-display text-[28px] leading-none">
            {t("promiseTrips")}
          </div>
          <div className="font-display text-[15px] italic opacity-55">
            {t("promiseTripsLabel")}
          </div>
        </div>
        <div className="border-r border-fg/22 px-3 py-[14px]">
          <div className="mb-2 font-mono text-[10px] tracking-[0.24em] opacity-50">
            02
          </div>
          <div className="mb-1 font-display text-[28px] leading-none">
            {t("promiseDays")}
          </div>
          <div className="font-display text-[15px] italic opacity-55">
            {t("promiseDaysLabel")}
          </div>
        </div>
        <div className="px-3 py-[14px]">
          <div className="mb-2 font-mono text-[10px] tracking-[0.24em] opacity-50">
            03
          </div>
          <div className="mb-1 font-display text-[28px] leading-none">
            {t("promiseVisas")}
          </div>
          <div className="font-display text-[15px] italic opacity-55">
            {t("promiseVisasLabel")}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-[22px] pt-7">
        <div className="mb-[14px] flex justify-between">
          <div className="font-mono text-[11px] tracking-[0.28em] opacity-60">
            {t("howItWorksTitle")}
          </div>
          <div className="font-mono text-[10px] tracking-[0.22em] opacity-45">
            {t("howItWorksCount")}
          </div>
        </div>
        <ol className="m-0 list-none p-0 space-y-0">
          {[
            { title: t("step1Title"), desc: t("step1Desc"), roman: "I" },
            { title: t("step2Title"), desc: t("step2Desc"), roman: "II" },
            { title: t("step3Title"), desc: t("step3Desc"), roman: "III" },
          ].map((step, idx) => (
            <li
              key={idx}
              className={cn(
                "grid grid-cols-[44px_1fr] gap-[14px] border-t border-fg/22 py-[14px]",
                idx === 2 && "border-b"
              )}
            >
              <div className="font-display text-[32px] leading-none italic text-accent font-feature-settings-smcp">
                {step.roman}
              </div>
              <div>
                <div className="mb-1 font-display text-[22px] leading-[1.1] tracking-[-0.01em]">
                  {step.title}
                </div>
                <p className="m-0 font-body text-[13.5px] leading-[1.5] text-fg-muted">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="fixed bottom-0 left-0 right-0 z-10 flex flex-col border-t border-fg/22 bg-bg px-[22px] py-4">
        <Stack gap="sm">
          {authProviders.map((provider) => (
            <div key={provider.name}>
              <SignInButton name={provider.name} id={provider.id} />
            </div>
          ))}

          <p className="text-center font-body text-[11px] leading-[1.45] text-fg-muted">
            {t("disclaimer")}
          </p>

          <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.18em] opacity-50">
            <span>v {process.env.NEXT_PUBLIC_APP_VERSION}</span>
          </div>
        </Stack>

        {process.env.NODE_ENV !== "production" && (
          <form
            action="/api/dev-login"
            method="post"
            className="flex justify-center"
          >
            <button
              type="submit"
              className="cursor-pointer border-none bg-none p-0 font-mono text-[11px] tracking-[0.16em] opacity-50 transition-opacity hover:opacity-70"
            >
              {t("devSignIn")}
            </button>
          </form>
        )}
      </footer>
    </div>
  );
}
