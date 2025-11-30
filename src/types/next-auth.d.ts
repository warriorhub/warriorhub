import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      randomKey?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    randomKey?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    randomKey?: string;
  }
}
