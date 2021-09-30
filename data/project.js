import Project from '../models/project';
import dbConnect from '../util/dbConnect';
import { hash } from 'bcryptjs';
import { generateKey } from '../utils/backValidation';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const validate = (project) => {
  const result = {
    isValid: true,
    client: project,
    error: '',
  };

  // validate name
  if (name.length <= 0 || !validateIsValidName(name)) {
    result.error = 'Invalid name';
  } else if (!validateIsFullName(name)) {
    result.error = 'Not a full name';
  }
  if (result.error.length > 0) {
    result.isValid = false;
    return result;
  }

  // validate email
  if (email.length <= 0 || !validateEmail(email)) {
    result.error = 'Invalid email';
    result.isValid = false;
    return result;
  }

  // validate CPF
  if (cpf.length <= 0 || !validateCPF(cpf)) {
    result.error = 'Invalid cpf';
    result.isValid = false;
    return result;
  }

  // validate phone
  if (!validatePhone(phone)) {
    result.error = 'Invalid phone';
    result.isValid = false;
    return result;
  }

  // validate password
  if (!validatePasswordLength(password)) {
    result.error = 'Password too short';
  } else if (!validatePasswordStrength(password)) {
    result.error = 'Password too week';
  }
  if (result.error.length > 0) {
    result.isValid = false;
    return result;
  }

  // validate password confirmation
  if (password !== passwordConf) {
    result.error = "Password and Password Confirmation don't match";
    result.isValid = false;
    return result;
  }

  return result;
};

export async function postProject(project) {
  // const validation = validate(project);
  console.log('Here');
  // let newProject;

  // if (validation.isValid) {
  //   newProject = new Client({
  //     name: validation.client.name,
  //     email: validation.client.email,
  //     cpf: validation.client.cpf,
  //     phone: validation.client.phone,
  //     type: process.env.USERCLI,
  //     hashPassword: await hashPassword(validation.client.password),
  //   });
  // } else {
  //   throw new Error('ERN0C1: Invalid - ' + validation.error);
  // }

  try {
    await dbConnect();
  } catch (err) {
    console.log(err);
    throw new Error('ERN0C1: ' + err.message);
  }
  console.log('Connected');

  try {
    // const exists = await Client.findOne().byEmail(validation.client.email);
    console.log('Connected');
    // if (exists) {
    //   throw new Error('DUPLICATED');
    // }
    // const created = await newClient.save();
    return true;
  } catch (err) {
    if (err.message.startsWith('DUPLICATED')) {
      throw new Error('DUPLICATED');
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
