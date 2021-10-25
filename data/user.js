import User from '../models/user';
import dbConnect from '../util/dbConnect';
import { sendRecoveryEmail } from '../util/email';
import { hash, compare } from 'bcryptjs';
import {
  validateEmail,
  generateKey,
  validatePasswordLength,
  validatePasswordStrength,
} from '../validation/backValidation';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

export async function postUser(email, password) {
  if (!email) {
    throw new Error('ERN0U1: Email obrigatório');
  } else if (!validateEmail(email)) {
    throw new Error('ERN0U1: Email inválido');
  } else if (
    !validatePasswordLength(password) ||
    !validatePasswordStrength(password)
  ) {
    throw new Error('ERN0U1: Senha muito fraca');
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
    let user = await User.findOne()
      .byEmail(email)
      .select('_id email active permission lastAccess');
    return user;
  } catch (err) {
    throw new Error('ERN0U6: ' + err.message);
  }
}

export async function getUserById(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U7: ' + err.message);
  }

  try {
    let user = await User.findById(_id);
    return user;
  } catch (err) {
    throw new Error('ERN0U8: ' + err.message);
  }
}

export async function authenticate(email, password) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U9: ' + err.message);
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
      throw new Error('ERN0U10: ' + err.message);
    }
  }
}

export async function deletetUser(id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U11: ' + err.message);
  }

  try {
    let user = await User.findByIdAndDelete(id);
    return user;
  } catch (err) {
    throw new Error('ERN0U12: ' + err.message);
  }
}

export async function passwordRecover(email, log) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U13: ' + err.message);
  }

  try {
    const user = await User.findOne().byEmail(email);
    if (!user) {
      throw new Error('404');
    }
    const recoveryToken = await generateKey(64);
    const date = new Date();
    const exp = new Date();
    exp.setTime(date.getTime() + 1 * 60 * 60 * 1000);
    log = {
      ...log,
      recoveryToken: recoveryToken,
      requestedOn: date,
      exp: exp,
    };
    if (!user.recoveryLogs) user.recoveryLogs = [log];
    else user.recoveryLogs.push(log);

    if (!user.active) user.active = true;

    await user.save();

    const emailSent = await sendRecoveryEmail(user);

    if (emailSent) return user.email;
    return null;
  } catch (err) {
    if (err.message.startsWith('404')) {
      throw new Error('404');
    } else {
      throw new Error('ERN0U14: ' + err.message);
    }
  }
}

export async function resetPassword(userId, email, recoveryToken, newPassword) {
  if (!userId || !email || !recoveryToken || !newPassword) {
    throw new Error('ERN0U15: Informações incompletas');
  } else if (
    !validatePasswordLength(newPassword) ||
    !validatePasswordStrength(newPassword)
  ) {
    throw new Error('ERN0U15: Senha muito fraca');
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U16: ' + err.message);
  }

  try {
    const date = new Date();
    const user = await User.findById(userId);

    if (!user) throw new Error('ERN0U17');
    if (!user.recoveryLogs || user.recoveryLogs.length === 0)
      throw new Error('ERN0U17');

    const recovery = user.recoveryLogs[user.recoveryLogs.length - 1];

    if (
      user.email !== email ||
      recovery.recoveryToken !== recoveryToken ||
      !!recovery.recoveredOn
    )
      throw new Error('ERN0U17');

    if (recovery.exp.getTime() < date.getTime()) {
      throw new Error('ERN0U18');
    }

    user.hashPassword = await hashPassword(newPassword);
    user.recoveryLogs[user.recoveryLogs.length - 1].recoveredOn = date;

    const recovered = await user.save();

    return recovered.email;
  } catch (err) {
    if (err.message === 'ERN0U17' || err.message === 'ERN0U18') {
      throw new Error(err.message);
    } else {
      throw new Error('ERN0U19: ' + err.message);
    }
  }
}

export async function setNewPasswordFirstAccess(email, newPassword) {
  if (!email || !newPassword) {
    throw new Error('ERN0U20: Informações incompletas');
  } else if (
    !validatePasswordLength(newPassword) ||
    !validatePasswordStrength(newPassword)
  ) {
    throw new Error('ERN0U20: Senha muito fraca');
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U21: ' + err.message);
  }

  try {
    const user = await User.findOne().byEmail(email);
    if (!user) throw new Error('ERN0U22');
    if (user.active) throw new Error('ERN0U23');

    user.hashPassword = await hashPassword(newPassword);
    user.active = true;

    const saved = await user.save();

    return saved.email;
  } catch (err) {
    if (err.message === 'ERN0U24') {
      throw new Error(err.message);
    } else {
      throw new Error('ERN0U25: ' + err.message);
    }
  }
}

export async function saveUserLog(user, log) {
  if (!user) {
    throw new Error('ERN0U26: Usuário não encontrado');
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U27: ' + err.message);
  }

  try {
    await User.findByIdAndUpdate(user._id, {
      $push: {
        accessLogs: {
          ...log,
        },
      },
    });
    return true;
  } catch (err) {
    console.log(err)
    throw new Error('ERN0U28: ' + err.message);
  }
}

export async function getUserHash(email) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0U29: ' + err.message);
  }

  try {
    let user = await User.findOne()
      .byEmail(email)
      .select('_id email active permission lastAccess hashPassword');
    return user;
  } catch (err) {
    throw new Error('ERN0U30: ' + err.message);
  }
}
