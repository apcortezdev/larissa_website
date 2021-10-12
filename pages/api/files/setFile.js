import fs from 'fs';
import path from 'path';
import nextConnect from 'next-connect';
import upload from '../../../util/upload';
import { getSession } from 'next-auth/client';
import { getUserByEmail } from '../../../data/user';
import { addFileToProject, removeFileFromProject } from '../../../data/project';

function onError(err, req, res, next) {
  console.log(err);
  res.status(500).end(err.toString());
}

function onNoMatch(err, req, res, next) {
  res.status(405).end('Method Not Allowed');
}

const handler = nextConnect({ onError, onNoMatch });

handler.use(async (req, res, next) => {
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
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      statusCode: '500',
      message: 'ERROR SAVING: ' + err.message,
    });
  }
});

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  try {
    const updatedProject = await addFileToProject(req.body.projId, {
      name: req.file.originalname,
      size: req.file.size,
      key: req.file.key,
      url:
        process.env.STORAGE_TYPE === 'local'
          ? req.file.path
          : req.file.location,
    });

    res.status(201).json({
      statusCode: '201',
      project: {
        _id: updatedProject._id,
        name: updatedProject.name,
        files: updatedProject.files,
      },
    });
  } catch (err) {
    res.status(500).json({
      statusCode: '500',
      message: 'ERROR SAVING: ' + err.message,
    });
  }
});

handler.delete(async (req, res) => {
  try {
    const updatedProject = await removeFileFromProject(
      req.body.projId,
      req.body.fileId
    );

    if (process.env.STORAGE_TYPE === 'local') {
      const dir = path.resolve(
        process.cwd(),
        'public',
        'tempFiles',
        updatedProject.key
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
    }

    res.status(201).json({
      statusCode: '201',
      project: {
        _id: updatedProject._id,
        name: updatedProject.name,
        files: updatedProject.files,
      },
    });
  } catch (err) {
    res.status(500).json({
      statusCode: '500',
      message: 'ERROR SAVING: ' + err.message,
    });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
