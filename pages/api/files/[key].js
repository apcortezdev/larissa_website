import aws from 'aws-sdk';
import { getSession } from 'next-auth/client';
import { getUserByEmail } from '../../../data/user';
import fs from 'fs';
import s3Object from '../../../util/s3';
const { Duplex } = require('stream');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    try {
      const user = await getUserByEmail(session.user.email);
      if (
        user.permission !== process.env.PERM_ADM &&
        session.user.email !== req.body.cliEmail
      ) {
        res.status(403).json({ message: 'Forbidden.' });
        return;
      }

      const s3 = s3Object();
      // const file = await s3
      //   .getObject({ Bucket: process.env.AWS_BUCKET, Key: req.query.key })
      //   .promise();
      const url = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET,
        Key: req.query.key,
        Expires: 60,
      });
      res.status(200).json({ statusCode: '200', url: url });

    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR ' + err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
