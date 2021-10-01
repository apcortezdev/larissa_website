import { postUser, getUserByEmail } from './user';
import Project from '../models/project';
import dbConnect from '../util/dbConnect';
import {
  validateIsValidName,
  validateEmail,
  validateCPF,
  validateCNPJ,
  validateState,
  validatePhone,
  generateKey,
} from '../util/backValidation';

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
  } else if (
    project.firstName.length < 2 ||
    !validateIsValidName(project.firstName)
  ) {
    errors.push('Nome do Cliente inválido');
  }

  // lastName
  if (!project.lastName) {
    errors.push('Sobrenome do Cliente obrigatório');
  } else if (
    project.lastName.length < 1 ||
    !validateIsValidName(project.lastName)
  ) {
    errors.push('Sobrenome do Cliente inválido');
  }

  // email
  if (!project.email) {
    errors.push('Email obrigatório');
  } else if (!validateEmail(project.email)) {
    errors.push('Email inválido');
  }

  // cpf/cnpj
  if (
    !project.cpfCnpj ||
    (project.cpfCnpj.length !== 11 && project.cpfCnpj.length !== 14) ||
    (project.cpfCnpj.length === 11 && !validateCPF(project.cpfCnpj)) ||
    (project.cpfCnpj.length === 14 && !validateCNPJ(project.cpfCnpj))
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
  const errors = hasErrors(project);
  if (errors.length !== 0) {
    throw new Error('ERN0P1:' + errors.join(','));
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P2: ' + err.message);
  }

  try {
    let passTemp = null;
    let user = await getUserByEmail(project.email);
    if (!user) {
      passTemp = await generateKey(8);
      user = await postUser(project.email, passTemp);
    }

    let newProject;
    newProject = new Project({
      name: project.name,
      client: user,
      clientFirstName: project.firstName,
      clientLastName: project.lastName,
      clientEmail: project.email,
      clientCpfCnpj: project.cpfCnpj,
      clientPhone: project.phone,
      address1: project.address1,
      address2: project.address2,
      city: project.city,
      state: project.state,
      cep: project.cep,
    });
    const created = await newProject.save();

    // Send email to project.email here:
    // - if passTemp not null, is new user, sent to create password
    // - if passTemp null, new proj, sent saying the proj is online

    return created;
  } catch (err) {
    throw new Error('ERN0P3: ' + err.message);
  }
}

export async function getProjects() {
  let projects = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P4');
  }

  try {
    projects = await Project.find();
  } catch (err) {
    if (err) {
      throw new Error('ERN0P5');
    }
  }
  return projects;
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
