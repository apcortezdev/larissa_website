import { getSession } from 'next-auth/client';
import {
  postProject,
  deleteProject,
  getProjectsByClientEmail,
} from '../../data/project';
import { getUserByEmail } from '../../data/user';

const get = async (req, res) => {
  try {
    const projs = await getProjectsByClientEmail(req.query.email);
    let perm;
    if (projs.client.permission === process.env.PERM_ADM) {
      perm = 'adm';
    } else {
      perm = 'cli';
    }
    res.status(200).json({
      statusCode: '200',
      client: {
        email: projs.client.email,
        permission: perm,
      },
      projects: projs.projects,
    });
  } catch (err) {
    if (err.message === '404') {
      res.status(404).json({
        statusCode: '404',
        message: 'Projects not found',
      });
      return;
    }
    res.status(500).json({
      statusCode: '500',
      message: 'ERROR UPDATING COLOR: ' + err.message,
    });
  }
};

const post = async (req, res) => {
  try {
    const newProject = await postProject({
      name: req.body.project.name.trim(),
      firstName: req.body.project.firstName.trim(),
      lastName: req.body.project.lastName.trim(),
      email: req.body.project.email.trim(),
      cpfCnpj: req.body.project.cpfCnpj.trim(),
      phone: req.body.project.phone.trim(),
      address1: req.body.project.address1.trim(),
      address2: req.body.project.address2.trim(),
      city: req.body.project.city.trim(),
      state: req.body.project.state.trim(),
      cep: req.body.project.cep.trim(),
    });
    res.status(201).json({ statusCode: '201', project: newProject });
  } catch (err) {
    console.log(err);
    if (err.message.startsWith('ERN0P1')) {
      res.status(400).json({
        statusCode: '400',
        message: err.message.slice(7),
      });
    } else {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR: ' + err.message,
      });
    }
  }
};

const del = async (req, res) => {
  try {
    const deletedProject = await deleteProject(req.body.projId, req.body.email);
    res
      .status(200)
      .json({
        statusCode: '200',
        deleted: {
          project: !!deletedProject.proj,
          client: !!deletedProject.user,
        },
      });
  } catch (err) {
    console.log(err);
    if (err.message.startsWith('ERN0P1')) {
      res.status(400).json({
        statusCode: '400',
        message: err.message.slice(7),
      });
    } else {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR: ' + err.message,
      });
    }
  }
};

export default async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  let user;
  switch (req.method) {
    case 'GET':
      if (session.user.email !== req.query.email) {
        return res.status(403).json({ message: 'Forbidden.' });
      }
      return await get(req, res);
    case 'POST':
      user = await getUserByEmail(session.user.email);
      if (user.permission !== process.env.PERM_ADM) {
        return res.status(403).json({ message: 'Forbidden.' });
      }
      return await post(req, res);
    case 'DELETE':
      user = await getUserByEmail(session.user.email);
      if (user.permission !== process.env.PERM_ADM) {
        return res.status(403).json({ message: 'Forbidden.' });
      }
      return await del(req, res);
    default:
      res.status(405).json({
        statusCode: '405',
        message: 'Method Not Allowed',
      });
  }
}
