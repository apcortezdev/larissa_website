import User from '../models/user';
import dbConnect from '../util/dbConnect';
import { hash, compare } from 'bcryptjs';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

export async function authenticate(email, password) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C1: ' + err.message);
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
      throw new Error('ERN0C10: ' + err.message);
    }
  }
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
