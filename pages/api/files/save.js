import nextConnect from 'next-connect';
import upload from '../../../util/upload';
import { getSession } from 'next-auth/client';
import { getUserByEmail } from '../../../data/user';
import { getProjectById, addFileToProject } from '../../../data/project';

function onError(err, req, res, next) {
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

  if (!req.headers['project-id'] || !req.headers['client-email']) {
    res.status(400).json({ message: 'Information Missing.' });
    return;
  }

  try {
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    const proj = await getProjectById(req.headers['project-id']);
    if (
      user.permission !== process.env.PERM_ADM &&
      session.user.email !== proj.clientEmail
    ) {
      res.status(403).json({ message: 'Forbidden.' });
      return;
    }

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
  console.log(req.file.originalname);
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
    console.log('all good');
    res.status(201).json({
      statusCode: '201',
      project: updatedProject,
    });
  } catch (err) {
    console.log('error');
    console.log(err);
    // delete file here
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
