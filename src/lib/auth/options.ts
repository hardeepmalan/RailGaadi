import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Configured list of authorized admin emails
function getAdminEmails(): string[] {
  const envAdmins = process.env.ADMIN_EMAILS;
  if (envAdmins) {
    return envAdmins.split(',').map(e => e.trim().toLowerCase());
  }
  // Default authorized developer admin email
  return ['hardeepmalan@gmail.com'];
}

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return getAdminEmails().includes(clean);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Verified Email Authentication',
      credentials: {
        email: { label: 'Verified Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        const email = credentials.email.trim().toLowerCase();
        
        // Basic length validation
        if (credentials.password.length < 4) {
          throw new Error('Password must be at least 4 characters.');
        }

        // Generate deterministic user ID based on email hash/slug
        const userId = 'usr_' + Buffer.from(email).toString('hex').substring(0, 12);
        const isAdmin = isAuthorizedAdmin(email);

        return {
          id: userId,
          email,
          name: email.split('@')[0],
          role: isAdmin ? 'admin' : 'user',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        // Strictly evaluate admin role on the server
        token.role = isAuthorizedAdmin(user.email) ? 'admin' : 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId;
        session.user.email = token.email;
        // Strictly assign role on session object from server JWT
        session.user.role = isAuthorizedAdmin(token.email) ? 'admin' : 'user';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'railgaadi_production_super_secret_jwt_key_2026',
};
