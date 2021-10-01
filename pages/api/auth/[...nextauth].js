import NextAuth from 'next-auth';
import providers from 'next-auth/providers';
import dbConnect from '../../../utils/dbConnect';
import Client from '../../../models/client';
import { compare } from 'bcryptjs';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    providers.Credentials({
      async authorize(credentials) {
        await dbConnect();
        const user = await Client.findOne().byEmail(credentials.email);
        if (!user) {
          throw new Error('Not found');
        }
        const isValid = await compare(credentials.password, user.hashPassword);

        if (!isValid) {
          throw new Error('Incorrect Password');
        }

        return {
          name: user.type === process.env.USERADM ? process.env.USERADM : user.name,
          email: user.email,
        };
      },
    }),
  ],
});
