import { getSession } from 'next-auth/client';
import { getUserByEmail } from '../../data/user';

const get = async (req, res) => {
  try {
    const user = await getUserByEmail(req.query.email);
    if (!user) {
      res.status(404).json({
        statusCode: '404',
        message: 'Not Found.',
      });
      return;
    }
    let permission;
    if (user.permission === process.env.PERM_CLI) {
      permission = 'cli';
    } else if (user.permission === process.env.PERM_ADM) {
      permission = 'adm';
    }
    res.status(200).json({
      statusCode: '200',
      permission: permission,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: '500',
      message: 'ERROR UPDATING COLOR: ' + err.message,
    });
  }
};

export default async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  switch (req.method) {
    case 'GET':
      if (session.user.email !== req.query.email) {
        return res.status(403).json({ message: 'Forbidden.' });
      }
      return await get(req, res);
    default:
      res.status(405).json({
        statusCode: '405',
        message: 'Method Not Allowed',
      });
  }
}
