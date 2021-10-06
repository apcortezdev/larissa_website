import NextAuth from 'next-auth';
import providers from 'next-auth/providers';
import dbConnect from '../../../util/dbConnect';
import User from '../../../models/user';
import { compare } from 'bcryptjs';

export default NextAuth({
  session: {
    jwt: { secret: process.env.JWT_SECRET },
  },
  providers: [
    providers.Credentials({
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne().byEmail(credentials.email);
        if (!user) {
          throw new Error('Not found');
        }
        const isValid = await compare(credentials.password, user.hashPassword);

        if (!isValid) {
          throw new Error('Incorrect Password');
        }

        return {
          email: user.email,
        };
      },
    }),
  ],
});
