import { getSession } from 'next-auth/client';
import { postProject } from '../../data/project';
import { getUserByEmail } from '../../data/user';

const get = async (req, res) => {
  try {
    console.log(req.query);
    res.status(200).json({ statusCode: '200' });
  } catch (err) {
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

export default async function handler(req, res) {
    const session = await getSession({ req: req });
    const user = await getUserByEmail(session.user.email);

    if (user.permission !== process.env.PERM_ADM) {
      res.status(404).json({ message: 'Not Found.' });
      return;
    }

  switch (req.method) {
    case 'GET':
      return await get(req, res);
    case 'POST':
      return await post(req, res);
    default:
      res.status(405).json({
        statusCode: '405',
        message: 'Method Not Allowed',
      });
  }
}
