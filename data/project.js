import Client from '../models/client';
import dbConnect from '../utils/dbConnect';
import { hash } from 'bcryptjs';
import {
  validateEmail,
  validateCPF,
  validateIsFullName,
  validateIsValidName,
  validatePhone,
  validatePasswordLength,
  validatePasswordStrength,
} from '../utils/validation';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const validate = ({ name, email, cpf, phone, password, passwordConf }) => {
  const result = {
    isValid: true,
    client: { name, email, cpf, phone, password, passwordConf },
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

export async function postClient(client) {
  const validation = validate(client);
  let newClient;

  if (validation.isValid) {
    newClient = new Client({
      name: validation.client.name,
      email: validation.client.email,
      cpf: validation.client.cpf,
      phone: validation.client.phone,
      type: process.env.USERCLI,
      hashPassword: await hashPassword(validation.client.password),
    });
  } else {
    throw new Error('ERN0C1: Invalid - ' + validation.error);
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C9: ' + err.message);
  }

  try {
    const exists = await Client.findOne().byEmail(validation.client.email);
    if (exists) {
      throw new Error('DUPLICATED');
    }
    const created = await newClient.save();
    return created;
  } catch (err) {
    if (err.message.startsWith('DUPLICATED')) {
      throw new Error('DUPLICATED');
    } else {
      throw new Error('ERN0C10: ' + err.message);
    }
  }
}
