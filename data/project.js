import dbConnect from '../util/dbConnect';
import User from '../models/user';
import Project from '../models/project';
import { postUser, deletetUser, getUserByEmail, sendEmail } from './user';
import { deleteFiles } from './file';
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
  } else if (project.name.length < 5) {
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

    return {
      _id: created._id,
      name: created.name,
      clientFirstName: created.clientFirstName,
      clientLastName: created.clientLastName,
      clientEmail: created.clientEmail,
      clientCpfCnpj: created.clientCpfCnpj,
      clientPhone: created.clientPhone,
      address1: created.address1,
      address2: created.address2,
      city: created.city,
      state: created.state,
      cep: created.cep,
      createdOn: created.createdOn,
      files: created.files,
    };
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
    projects = await Project.find().select(
      '_id name clientFirstName clientLastName clientEmail clientCpfCnpj clientPhone address1 address2 city state cep createdOn files'
    );
  } catch (err) {
    if (err) {
      throw new Error('ERN0P5');
    }
  }
  return projects;
}

export async function getProjectsByClientEmail(email) {
  let projects = [];
  let user;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P6');
  }

  try {
    user = await User.findOne().byEmail(email).select('_id email permission');
    projects = await Project.find().byEmail(email).select('_id name files');
  } catch (err) {
    if (err) {
      throw new Error('ERN0P7');
    }
  }
  return { client: user, projects };
}

export async function addFilesToProject(_id, files) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P8');
  }

  try {
    let project = await Project.findById(_id);
    project.files = project.files.concat(files);
    return await project.save();
  } catch (err) {
    if (err) {
      throw new Error('ERN0P9');
    }
  }
  return { project: project };
}

export async function removeFilesFromProject(projId, fileId) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P10');
  }

  try {
    let project = await Project.findById(projId);
    let newFiles = [];
    for (let i = 0; i < project.files.length; i++) {
      const file = project.files[i];
      if (file._id.toString() !== fileId) newFiles.push(file);
    }
    project.files = newFiles;
    return await project.save();
  } catch (err) {
    if (err) {
      throw new Error('ERN0P11');
    }
  }
  return { project: project };
}

export async function deleteProject(projId, email) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P12: ' + err.message);
  }

  try {
    let user;
    await deleteFiles(projId);
    const projs = await getProjectsByClientEmail(email);
    const proj = await Project.findByIdAndDelete(projId);
    if (projs.projects.length === 1) {
      // delete client if has only this project
      user = await deletetUser(projs.client._id.toString());
    }
    return { proj, user };
  } catch (err) {
    throw new Error('ERN0P13: ' + err.message);
  }
}
