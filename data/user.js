import User from '../models/user';
import dbConnect from '../util/dbConnect';
import { hash, compare } from 'bcryptjs';
import { validateEmail } from '../util/backValidation';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

export async function postUser(email, password) {
  console.log(email + ': ' + password);
  if (!email) {
    throw new Error('ERN0U1: Email obrigatório');
  } else if (!validateEmail(email)) {
    throw new Error('ERN0U1: Email inválido');
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U2: ' + err.message);
  }

  try {
    let user = await User.findOne().byEmail(email);
    if (!user) {
      const newUser = new User({
        email: email,
        permission: process.env.PERM_CLI,
        hashPassword: await hashPassword(password),
      });
      user = await newUser.save();
    } else {
      throw new Error('DUPLICATED');
    }
    return user;
  } catch (err) {
    if (err.message.startsWith('DUPLICATED')) {
      throw new Error('ERN0U3: DUPLICATED');
    } else {
      throw new Error('ERN0U4: ' + err.message);
    }
  }
}

export async function getUserByEmail(email) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U5: ' + err.message);
  }

  try {
    let user = await User.findOne().byEmail(email);
    return user;
  } catch (err) {
    throw new Error('ERN0U6: ' + err.message);
  }
}

export async function authenticate(email, password) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U7: ' + err.message);
  }

  try {
    const user = await User.findOne().byEmail(email);
    if (!user) {
      throw new Error('404');
    }

    const isValid = await compare(password, user.hashPassword);
    if (!isValid) {
      throw new Error('401');
    }

    const updated = await User.findByIdAndUpdate(user._id, {
      lastActive: new Date(),
    });

    return updated.email;
  } catch (err) {
    if (err.message.startsWith('404')) {
      throw new Error('404');
    } else {
      throw new Error('ERN0U8: ' + err.message);
    }
  }
}

export async function deletetUser(id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U9: ' + err.message);
  }

  try {
    let user = await User.findByIdAndDelete(id);
    return user;
  } catch (err) {
    throw new Error('ERN0U10: ' + err.message);
  }
}

export async function sendEmail(type = 'new', user, tempPassword) {
  if (type === 'new') {
    // send email to new user w/ temp password
  } else {
    // send notification proj is on
  }
  return false;
}

export async function passwordRecover(email, log) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C1: ' + err.message);
  }

  try {
    const project = await Project.findOne().byEmail(email);
    if (!project) {
      throw new Error('404');
    }
    const date = new Date();
    const requested = await Project.findByIdAndUpdate(project._id, {
      lastRecoveryString: await generateKey(20),
      lastRecoveryTime: date,
      lastRecoveryActive: true,
      recoveryLogs: project.recoveryLogs.push({ ...log, requestedOn: date }),
    });

    return requested.email;
  } catch (err) {
    if (err.message.startsWith('404')) {
      throw new Error('404');
    } else {
      throw new Error('ERN0C10: ' + err.message);
    }
  }
}
