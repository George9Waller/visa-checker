import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const supported = ["en", "fr"];
  const locale =
    (cookieLocale && supported.includes(cookieLocale) ? cookieLocale : "en");

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
