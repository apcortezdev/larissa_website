import fs from 'fs';
import path from 'path';
import { getSession } from 'next-auth/client';
import s3Object from '../../../util/s3';
import { getUserByEmail } from '../../../data/user';
import { getProjectById, removeFileFromProject } from '../../../data/project';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    try {
      const user = await getUserByEmail(session.user.email);
      const proj = await getProjectById(req.body.projId);
      if (
        user.permission !== process.env.PERM_ADM &&
        session.user.email !== proj.clientEmail
      ) {
        res.status(403).json({ message: 'Forbidden.' });
        return;
      }

      const toRemoveFileIndex = proj.files.findIndex(
        (f) => f._id.toString() === req.body.fileId
      );

      if (toRemoveFileIndex >= 0) {
        const file = proj.files[toRemoveFileIndex];

        if (process.env.STORAGE_TYPE === 'local') {
          const dir = path.resolve(
            process.cwd(),
            'public',
            'tempFiles',
            file.key
          );
          if (fs.existsSync(dir)) {
            fs.rm(dir, { recursive: true }, (err) => {
              if (err) {
                res.status(500).json({
                  statusCode: '500',
                  message: 'ERROR DELETING IMAGES: ' + err.message,
                });
                return;
              }
            });
          }
        } else {
          const s3 = s3Object();
          const status = await s3
            .deleteObject({
              Bucket: process.env.AWS_BUCKET,
              Key: file.key,
            })
            .promise();
          const removedFile = await removeFileFromProject(
            req.body.projId,
            req.body.fileId
          );
          if (removedFile)
            res.status(201).json({ statusCode: '201', removed: true });
          else
            res
              .status(500)
              .json({ statusCode: '500', message: 'Erro na base de dados' });
        }
      } else {
        res.status(404).json({ message: 'File Not Found.' });
      }
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
