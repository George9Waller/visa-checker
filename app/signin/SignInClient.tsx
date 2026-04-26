import { useTranslations } from "next-intl";
import { cn } from "@/app/design/cn";
import { APP_ESTABLISHED_YEAR } from "../constants";
import { getProviders, signIn } from "next-auth/react";

export default async function SignInClient() {
  const providers = await getProviders();
  const t = useTranslations("signin");

  return (
    <div className="relative min-h-screen flex flex-col bg-bg text-fg pb-40">
      {/* SVG Grid Backdrop */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.55]"
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

      {/* Masthead Header */}
      <header className="relative z-10 px-[22px] pt-5 flex flex-col gap-0">
        <div className="flex justify-between font-mono text-[11px] tracking-[0.22em] opacity-70">
          <span className="opacity-55">
            {t("established", { year: APP_ESTABLISHED_YEAR })}
          </span>
        </div>
        <div className="h-px bg-fg opacity-85 mt-[10px]" />
        <div className="h-px bg-fg opacity-18 mt-[3px]" />
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-[22px] pt-7">
        <div className="font-mono text-[11px] tracking-[0.28em] opacity-60 mb-[14px]">
          {t("kicker")}
        </div>
        <h1 className="font-display text-[clamp(54px,14vw,72px)] leading-[0.92] tracking-[-0.025em] mb-0">
          {t("headlinePart1")}
          <br />
          <em className="not-italic opacity-85">{t("headlinePart2")}</em>
          <br />
          {t("headlinePart3")}
        </h1>
        <p className="font-body text-[15.5px] text-fg-muted leading-[1.55] mt-[22px] max-w-[360px]">
          {t("body")}
        </p>
      </section>

      {/* Promise Strip — 3 Columns */}
      <section className="relative z-10 mx-[22px] mt-[26px] border-t border-fg border-b border-fg/25 grid grid-cols-3">
        {/* Trips */}
        <div className="px-3 py-[14px] border-r border-fg/22">
          <div className="font-mono text-[10px] tracking-[0.24em] opacity-50 mb-2">
            01
          </div>
          <div className="font-display text-[28px] leading-none mb-1">
            {t("promiseTrips")}
          </div>
          <div className="font-display text-[15px] italic opacity-55">
            {t("promiseTripsLabel")}
          </div>
        </div>
        {/* Days */}
        <div className="px-3 py-[14px] border-r border-fg/22">
          <div className="font-mono text-[10px] tracking-[0.24em] opacity-50 mb-2">
            02
          </div>
          <div className="font-display text-[28px] leading-none mb-1">
            {t("promiseDays")}
          </div>
          <div className="font-display text-[15px] italic opacity-55">
            {t("promiseDaysLabel")}
          </div>
        </div>
        {/* Visas */}
        <div className="px-3 py-[14px]">
          <div className="font-mono text-[10px] tracking-[0.24em] opacity-50 mb-2">
            03
          </div>
          <div className="font-display text-[28px] leading-none mb-1">
            {t("promiseVisas")}
          </div>
          <div className="font-display text-[15px] italic opacity-55">
            {t("promiseVisasLabel")}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-[22px] pt-7">
        <div className="flex justify-between mb-[14px]">
          <div className="font-mono text-[11px] tracking-[0.28em] opacity-60">
            {t("howItWorksTitle")}
          </div>
          <div className="font-mono text-[10px] tracking-[0.22em] opacity-45">
            {t("howItWorksCount")}
          </div>
        </div>
        <ol className="list-none m-0 p-0 space-y-0">
          {[
            { title: t("step1Title"), desc: t("step1Desc"), roman: "I" },
            { title: t("step2Title"), desc: t("step2Desc"), roman: "II" },
            { title: t("step3Title"), desc: t("step3Desc"), roman: "III" },
          ].map((step, idx) => (
            <li
              key={idx}
              className={cn(
                "grid grid-cols-[44px_1fr] gap-[14px] py-[14px] border-t border-fg/22",
                idx === 2 && "border-b"
              )}
            >
              <div className="font-display italic text-accent text-[32px] leading-none font-feature-settings-smcp">
                {step.roman}
              </div>
              <div>
                <div className="font-display text-[22px] leading-[1.1] tracking-[-0.01em] mb-1">
                  {step.title}
                </div>
                <p className="font-body text-[13.5px] leading-[1.5] text-fg-muted m-0">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer CTA */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 px-[22px] py-7 flex flex-col bg-bg border-t border-fg/22">
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            </div>
          ))}

        {/* Micro-print */}
        <div className="flex justify-between mt-3 font-mono text-[10px] tracking-[0.18em] opacity-50">
          <span>v {process.env.NEXT_PUBLIC_APP_VERSION}</span>
        </div>

        {/* Dev Sign-in (dev env only) */}
        {process.env.NODE_ENV !== "production" && (
          <form
            action="/api/dev-login"
            method="post"
            className="mt-4 flex justify-center"
          >
            <button
              type="submit"
              className="font-mono text-[11px] tracking-[0.16em] opacity-50 hover:opacity-70 transition-opacity bg-none border-none cursor-pointer p-0"
            >
              {t("devSignIn")}
            </button>
          </form>
        )}
      </footer>
    </div>
  );
}
