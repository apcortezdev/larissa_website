import { sendContactEmail } from '../../util/email';
import { validatePhone, validateEmail } from '../../validation/backValidation';

const validate = (name, phone, email, message) => {
  let valid = true;

  if (name.trim().length === 0) {
    valid = false;
  }
  if (phone.trim().length !== 0 && !validatePhone(phone.trim())) {
    valid = false;
  }
  if (email.trim().length === 0 || !validateEmail(email.trim())) {
    valid = false;
  }
  if (message.trim().length === 0) {
    valid = false;
  }
  return valid;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      if (
        validate(
          req.body.name.trim(),
          req.body.phone.trim(),
          req.body.email.trim(),
          req.body.message.trim()
        )
      ) {
        const sent = await sendContactEmail({
          name: req.body.name.trim(),
          phone: req.body.phone.trim(),
          email: req.body.email.trim(),
          message: req.body.message.trim(),
        });

        let code;
        if (sent) code = 201;
        else code = 500;

        res.status(code).json({
          statusCode: code.toString(),
          sent: sent,
        });
      } else {
        res.status(400).json({
          statusCode: '400',
          message: 'Informações Inválidas',
        });
      }
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
