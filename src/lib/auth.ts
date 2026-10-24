import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { fetchPortalMe, LINK_TOKEN_RE } from '@/lib/valeron';

// Link-based sign-in. There is no Google sign-in and no password: Valeron's
// Director generates a link (Settings → App Management in the main app) and
// opening it at /l/<token> signs the person in.
//
//   CUSTOMER   permanent — works until revoked or rotated in Valeron
//   TEMPORARY  for a caller — works until its expiry
//
// The token is kept inside the JWT (encrypted by NextAuth, never sent to the
// browser) and re-checked with Valeron every few minutes, so a revoke or an
// expiry signs an already-open browser out.

const RECHECK_MS = 5 * 60_000;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'link',
      name: 'Sign-in link',
      credentials: { token: { label: 'Token', type: 'text' } },
      async authorize(credentials) {
        const token = credentials?.token?.trim();
        if (!token || !LINK_TOKEN_RE.test(token)) return null;
        const me = await fetchPortalMe(token);
        if (!me.ok) return null;
        return {
          id: me.data.id,
          name: me.data.name,
          kind: me.data.kind,
          expiresAt: me.data.expiresAt,
          linkToken: token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.kind = user.kind;
        token.expiresAt = user.expiresAt;
        token.linkToken = user.linkToken;
        token.checkedAt = Date.now();
        token.invalid = false;
        return token;
      }
      if (token.linkToken && !token.invalid && Date.now() - (token.checkedAt ?? 0) > RECHECK_MS) {
        const me = await fetchPortalMe(token.linkToken);
        if (me.ok) {
          token.name = me.data.name;
          token.expiresAt = me.data.expiresAt;
          token.checkedAt = Date.now();
        } else if (me.status === 401) {
          // Revoked, rotated or expired in Valeron. A Valeron outage (any other
          // status) is not a reason to sign someone out.
          token.invalid = true;
          delete token.linkToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.name = token.name ?? '';
        session.user.kind = token.kind;
        session.user.expiresAt = token.expiresAt ?? null;
      }
      session.invalid = !!token.invalid;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

