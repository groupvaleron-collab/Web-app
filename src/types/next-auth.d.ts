import type { DefaultSession } from 'next-auth'
import type { LinkKind } from '@/lib/valeron'

declare module 'next-auth' {
  interface User {
    kind: LinkKind
    expiresAt: string | null
    linkToken: string
  }

  interface Session {
    /** True once Valeron has said the link is revoked, rotated or expired. */
    invalid?: boolean
    user: DefaultSession['user'] & {
      id: string
      kind?: LinkKind
      expiresAt: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    kind?: LinkKind
    expiresAt?: string | null
    /** The sign-in link's token. Server-side only — never copied into the session. */
    linkToken?: string
    checkedAt?: number
    invalid?: boolean
  }
}
