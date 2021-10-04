import { postUser, getUserByEmail, sendEmail } from './user';
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

    if (passTemp) {
      sendEmail('new', user, passTemp);
    } else {
      sendEmail('notification', user, passTemp);
    }

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