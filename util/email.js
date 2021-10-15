import Email from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_ACC,
    pass: process.env.EMAIL_PSS,
  },
});

const emailer = new Email({
  message: {
    from: `"Larissa Paschoalotto" <${process.env.EMAIL_ACC}>`,
  },
  // send: true,
  transport: transporter,
  juice: true,
  juiceResources: {
    relativeTo: path.resolve('.next'),
  },
  attachments: [{
    filename: 'lpaschoalotto_logo_30.png',
    path: path.resolve(__dirname, '..', '..', 'public', 'lpaschoalotto_logo_30.png'),
    cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
}]
});

export async function sendWelcomeEmail(user, passTemp) {
  return false;
}

export async function sendProjectNotificationEmail(user, notification) {
  return true;
}

export async function sendRecoveryEmail(user) {
  // process.env.APP_URL + '/' + user._id + '/' + user.recoveryLogs[user.recoveryLogs.length - 1].recoveryToken
  return true;
}

export async function sendContactEmail({ name, phone, email, message }) {
  console.log(path.resolve(__dirname, '..', '..', 'public', 'lpaschoalotto_logo_30.png'))
  try {
    const sent = await emailer.send({
      template: 'contact',
      message: {
        to: process.env.EMAIL_CONTACT,
      },
      locals: {
        css: path.resolve(process.cwd(), 'public', 'emails', 'contact.css'),
        name: name,
        phone: phone,
        email: email,
        message: message,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
