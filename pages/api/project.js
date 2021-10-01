// import { getSession } from 'next-auth/client';
import { postProject } from '../../data/project';

export default async function handler(req, res) {
  //   const session = await getSession({ req: req });

  //   if (!session || session.user.name !== process.env.USERADM) {
  //     res.status(404).json({ message: 'Not Found.' });
  //     return;
  //   }

  if (req.method === 'POST') {
    try {
      const newProject = await postProject(req.body.project);
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
    //   } else if (req.method === 'DELETE') {
    //     try {
    //       const deletedColor = await deleteColor(req.body.id);
    //       res.status(200).json({ statusCode: '200', color: deletedColor });
    //     } catch (err) {
    //       res.status(500).json({
    //         statusCode: '500',
    //         message: 'ERROR DELETING COLOR: ' + err.message,
    //       });
    //     }
    //   } else if (req.method === 'PUT') {
    //     try {
    //       const updatedColor = await putColor(
    //         req.body.id,
    //         req.body.newText,
    //         req.body.newCode
    //       );
    //       res.status(200).json({ statusCode: '200', color: updatedColor });
    //     } catch (err) {
    //       res.status(500).json({
    //         statusCode: '500',
    //         message: 'ERROR UPDATING COLOR: ' + err.message,
    //       });
    //     }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
