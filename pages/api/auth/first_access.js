import { getSession } from 'next-auth/client';
import { setNewPasswordFirstAccess } from '../../../data/user';

export default async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  if (session.user.email !== req.body.email) {
    res.status(403).json({ message: 'Forbidden.' });
    return;
  }

  if (req.method === 'POST') {
    const email = await setNewPasswordFirstAccess(req.body.email, req.body.newPassword)
    res.status(201).json({
        statusCode: '201',
        email: email,
      });
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
