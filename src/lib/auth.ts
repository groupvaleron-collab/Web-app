import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'groupvaleron@gmail.com';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in Supabase
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email!)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError);
          }

          if (!existingUser) {
            // Create new user in Supabase
            const isAdmin = user.email === ADMIN_EMAIL;
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                name: user.name || 'User',
                email: user.email!,
                google_id: account.providerAccountId,
                role: isAdmin ? 'admin' : 'user',
              });

            if (insertError) {
              console.error('Error creating user:', insertError);
            }
          } else {
            // Update google_id if not set
            if (!existingUser.google_id) {
              await supabase
                .from('users')
                .update({ google_id: account.providerAccountId })
                .eq('id', existingUser.id);
            }
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Fetch user data from Supabase to get role
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email!)
          .single();

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
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
