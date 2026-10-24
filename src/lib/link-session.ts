// Edge-safe (no provider imports): used by middleware and the API routes.

/** Whether a decoded session JWT still grants access. */
export function isLinkSessionValid(token: { linkToken?: string; invalid?: boolean; expiresAt?: string | null } | null): boolean {
  if (!token?.linkToken || token.invalid) return false
  return !token.expiresAt || Date.parse(token.expiresAt) > Date.now()
}
