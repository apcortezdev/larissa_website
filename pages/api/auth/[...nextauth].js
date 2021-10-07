import NextAuth from 'next-auth';
import providers from 'next-auth/providers';
import { getUserByEmail, setAccess } from '../../../data/user';
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
        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error('Not found');
        }

        const isValid = await compare(credentials.password, user.hashPassword);
        if (!isValid) {
          throw new Error('Incorrect Password');
        }

        const access = await setAccess(credentials.email);

        if (access === credentials.email)
          return {
            email: user.email,
          };
        throw new Error('Internal Error');
      },
    }),
  ],
});
