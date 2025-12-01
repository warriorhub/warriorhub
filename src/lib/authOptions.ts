/* eslint-disable arrow-body-style */
import { compare } from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },

  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@foo.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) return null;

        return {
          id: `${user.id}`,
          email: user.email,
          role: user.role, // GRAB THE ROLE HERE
        } as AuthUser;
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;
        return {
          ...token,
          id: u.id,
          role: u.role, // STORE ROLE IN JWT
        };
      }
      return token;
    },

    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string, // EXPOSE ROLE IN SESSION
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
