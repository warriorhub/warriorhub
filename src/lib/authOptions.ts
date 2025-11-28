/* eslint-disable arrow-body-style */
import { compare } from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

// Inline type for your user returned by authorize
interface AuthUser {
  id: string;
  email: string;
  randomKey: string; // keep your original property
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@foo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: `${user.id}`,
          email: user.email,
          randomKey: user.role,
        } as AuthUser;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    session({ session, token }) {
      // return a new object instead of mutating the parameter
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          randomKey: token.randomKey as string,
        },
      };
    },
    jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
    redirect() {
      return '/UserHome';
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
