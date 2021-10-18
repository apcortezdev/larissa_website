import Email from 'email-templates';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
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
});

export async function sendWelcomeEmail(user, passTemp) {
  try {
    const sent = await emailer.send({
      template: 'welcome',
      message: {
        to: user.email,
      },
      locals: {
        name: user.name,
        email: user.email,
        password: passTemp,
        link: process.env.APP_URL,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function sendProjectNotificationEmail(user) {
  try {
    const sent = await emailer.send({
      template: 'notify',
      message: {
        to: user.email,
      },
      locals: {
        link: process.env.APP_URL,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function sendRecoveryEmail(user) {
  const link =
    process.env.APP_URL +
    '/recovery/' +
    user._id +
    '/' +
    user.recoveryLogs[user.recoveryLogs.length - 1].recoveryToken;
  try {
    const sent = await emailer.send({
      template: 'recovery',
      message: {
        to: user.email,
      },
      locals: {
        name: user.name,
        link: link,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function sendContactEmail({ name, phone, email, message }) {
  try {
    const sent = await emailer.send({
      template: 'contact',
      message: {
        to: process.env.EMAIL_CONTACT,
      },
      locals: {
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
