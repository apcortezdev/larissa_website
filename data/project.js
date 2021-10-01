import Project from '../models/project';
import dbConnect from '../util/dbConnect';
import { hash } from 'bcryptjs';
import {
  validateIsValidName,
  validateEmail,
  validateCPF,
  validateCNPJ,
  validateState,
  validatePhone,
  generateKey,
} from '../util/backValidation';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const hasErrors = (project) => {
  // name
  let errors = [];
  if (!project.name) {
    errors.push('Nome do Projeto obrigatório');
  } else if (project.name.length < 5 || !validateIsValidName(project.name)) {
    errors.push('Nome do Projeto inválido');
  }

  // firstName
  if (!project.firstName) {
    errors.push('Nome do Cliente obrigatório');
  } else if (project.firstName < 2 || !validateIsValidName(project.firstName)) {
    errors.push('Nome do Cliente inválido');
  }

  // lastName
  if (!project.lastName) {
    errors.push('Sobrenome do Cliente obrigatório');
  } else if (project.lastName < 1 || !validateIsValidName(project.lastName)) {
    errors.push('Sobrenome do Cliente inválido');
  }

  // email
  if (!project.email) {
    errors.push('Email obrigatório');
  } else if (!validateEmail(project.email)) {
    errors.push('Email inválido');
  }

  // cpf/cnpj
  // console.log(validateCNPJ(project.cpfCnpj))
  if (
    !project.cpfCnpj ||
    (project.cpfCnpj.length !== 11 && project.cpfCnpj.length !== 14) ||
    (project.cpfCnpj.length === 11 && !validateCPF(project.cpfCnpj)) ||
    (project.cpfCnpj === 14 && !validateCNPJ(project.cpfCnpj))
  ) {
    errors.push('CPF/CNPJ inválido');
  }

  // phone
  if (!project.phone) {
    errors.push('Telefone obrigatório');
  } else if (!validatePhone(project.phone)) {
    errors.push('Telefone inválido');
  }

  // UF
  if (project.state?.length > 0 && !validateState(project.state)) {
    errors.push('UF inválido');
  }

  // CEP
  if (project.cep?.length > 0 && project.cep?.length < 8) {
    errors.push('CEP inválido');
  }

  return errors;
};

export async function postProject(project) {
  console.log(project);
  const errors = hasErrors(project);

  let newProject;
  const passTemp = await generateKey(8);
  if (errors.length === 0) {
    const passTempHash = await hashPassword(passTemp);
    newProject = new Project({
      name: project.name,
      firstName: project.firstName,
      lastName: project.lastName,
      email: project.email,
      cpfCnpj: project.cpfCnpj,
      phone: project.phone,
      address1: project.address1,
      address2: project.address2,
      city: project.city,
      state: project.state,
      cep: project.cep,
      hashPassword: passTempHash,
    });
  } else {
    throw new Error('ERN0P1:' + errors.join(','));
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P2: ' + err.message);
  }

  try {
    // const exists = await Client.findOne().byEmail(validation.client.email);
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
