const GUEST_KEY = "grainly_guest_token";
const HOST_KEY_PREFIX = "grainly_host_";

export function getGuestToken(): string {
  if (typeof window === "undefined") return "";
  let t = localStorage.getItem(GUEST_KEY);
  if (!t) {
    t = crypto.randomUUID();
    localStorage.setItem(GUEST_KEY, t);
  }
  return t;
}

export function rememberHostSecret(inviteCode: string, hostSecret: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HOST_KEY_PREFIX + inviteCode.toUpperCase(), hostSecret);
}

export function getHostSecret(inviteCode: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(HOST_KEY_PREFIX + inviteCode.toUpperCase());
}
