import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { getSession } from 'next-auth/client';
import { addFilesToProject, removeFilesFromProject } from '../../data/project';
import { getUserByEmail } from '../../data/user';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const saveFile = async (projId, file) => {
  const dir = path.join(process.cwd(), 'public', 'tempFiles', projId);
  if (!fs.existsSync(dir)) {
    // creates dir if not existent
    fs.mkdirSync(dir, { recursive: true });
  }

  const data = fs.readFileSync(file.path);
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'tempFiles', projId, file.name),
    data
  );
  // await fs.unlinkSync(file.path);
  return path.join(dir, file.name);
};

const post = async (req, res, session) => {
  const form = new formidable.IncomingForm({
    multiples: true,
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR PARSING: ' + err,
      });
      return;
    }

    const project = await JSON.parse(fields.project);
    const user = await getUserByEmail(session.user.email);

    if (
      user.permission !== process.env.PERM_ADM &&
      session.user.email !== project.cliEmail
    ) {
      res.status(403).json({ message: 'Forbidden.' });
      return;
    }

    try {
      let fileList = [];
      for (const key in files) {
        if (Object.hasOwnProperty.call(files, key)) {
          fileList.push(files[key]);
        }
      }

      let savedFiles = [];
      for (const file of fileList) {
        let fsSaved = await saveFile(project.projId, file);
        savedFiles.push({ name: file.name, uri: fsSaved });
      }

      const updatedProject = await addFilesToProject(
        project.projId,
        savedFiles
      );

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
};

const put = async (req, res, session) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR PARSING: ' + err,
      });
      return;
    }

    const project = await JSON.parse(fields.project);
    const user = await getUserByEmail(session.user.email);

    if (
      user.permission !== process.env.PERM_ADM &&
      session.user.email !== project.cliEmail
    ) {
      res.status(403).json({ message: 'Forbidden.' });
      return;
    }

    try {
      const dir = path.join(
        process.cwd(),
        'public',
        'tempFiles',
        project.projId,
        project.file.name
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

      const updatedProject = await removeFilesFromProject(
        project.projId,
        project.file._id
      );
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
        message: 'ERROR DELETING PRODUCT: ' + err.message,
      });
    }
  });
};

export default async (req, res) => {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  req.method === 'POST'
    ? post(req, res, session)
    : req.method === 'PUT'
    ? put(req, res, session)
    : res.status(405).send('Method Not Allowed.');
};
