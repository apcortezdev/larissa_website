import NextAuth from 'next-auth';
import providers from 'next-auth/providers';
import { getUserByEmail, getUserHash, saveUserLog } from '../../../data/user';
import { compare } from 'bcryptjs';

export default NextAuth({
  jwt: {
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  session: {
    jwt: true,
  },
  providers: [
    providers.Credentials({
      async authorize(credentials) {
        const user = await getUserHash(credentials.email);
        if (!user) {
          throw new Error('Not found');
        }

        const isValid = await compare(credentials.password, user.hashPassword);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        const log = await JSON.parse(credentials.log);

        if (!log) {
          throw new Error('Log not possible');
        }

        const logged = await saveUserLog(user, log);

        if (!logged) {
          throw new Error('Log not possible');
        }

        return {
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt(token) {
      const user = await getUserByEmail(token.email);
      token.active = user.active;
      token.perms = user.permission === process.env.PERM_ADM ? 'adm' : 'cli';
      return token;
    },
    async session(session, token) {
      let firstAccess;
      let perms;

      if (token) {
        firstAccess = !token.active;
        perms = token.perms;
      } else {
        const user = await getUserByEmail(session.user.email);
        firstAccess = !user.active;
        perms = user.permission === process.env.PERM_ADM ? 'adm' : 'cli';
      }

      session.user.firstAccess = firstAccess;

      session.user.perms = perms;
      return session;
    },
  },
});
