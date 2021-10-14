import { getSession } from 'next-auth/client';
import s3Object from '../../../util/s3';
import { getUserByEmail } from '../../../data/user';
import { getProjectById } from '../../../data/project';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const projId = req.query.slug[0];
    const fileKey = req.query.slug[1];

    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    try {
      const user = await getUserByEmail(session.user.email);
      const proj = await getProjectById(projId);

      if (!user || !proj) {
        res.status(404).json({ message: 'Not Found.' });
        return;
      }

      if (
        user.permission !== process.env.PERM_ADM &&
        session.user.email !== proj.clientEmail
      ) {
        res.status(403).json({ message: 'Forbidden.' });
        return;
      }

      let url = '';
      if (process.env.STORAGE_TYPE === 'local') {
        url = process.env.APP_URL;
      } else {
        const s3 = s3Object();
        // const file = await s3
        //   .getObject({ Bucket: process.env.AWS_BUCKET, Key: fileKey })
        //   .promise();
        url = s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_BUCKET,
          Key: fileKey,
          Expires: 120,
        });
      }

      res.status(200).json({ statusCode: '200', url: url });
    } catch (err) {
      if (err.message === 'ERN0P15') {
        res.status(404).json({
          statusCode: '404',
          message: 'Usuário não encontrado.',
        });
      } else {
        res.status(500).json({
          statusCode: '500',
          message: 'ERROR ' + err.message,
        });
      }
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
