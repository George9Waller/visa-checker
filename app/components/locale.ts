export function setLocaleCookie(code: string) {
  document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
}
