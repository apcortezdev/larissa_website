import { passwordRecover } from '../../../data/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const recover = await passwordRecover(req.body.email, req.body.log);
      if (recover) res.status(201).json({ statusCode: '201', email: recover });
      else res.status(500).json({ statusCode: '500', message: 'Falha no envio de email.' });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR: ' + err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
