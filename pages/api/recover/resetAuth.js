import { resetPassword } from '../../../data/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const recover = await resetPassword(
        req.body.userId,
        req.body.email,
        req.body.recoveryToken,
        req.body.newPassword
      );
      res.status(201).json({ statusCode: '201', user: recover });
    } catch (err) {
      if (err.message === 'ERN0U17') {
        res.status(403).json({
          statusCode: '403',
          message: 'ERROR: Invalid Recovery',
        });
      } else if (err.message === 'ERN0U18') {
        res.status(403).json({
          statusCode: '403',
          message: 'ERROR: Recovery Expired',
        });
      } else {
        res.status(500).json({
          statusCode: '500',
          message: 'ERROR: ' + err.message,
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
