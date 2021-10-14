import fs from 'fs';
import path from 'path';
import dbConnect from '../util/dbConnect';
import { sendNewUserEmail, sendProjectNotificationEmail } from '../util/email';
import Project from '../models/project';
import { postUser, deletetUser, getUserByEmail } from './user';
import {
  validateIsValidName,
  validateEmail,
  validateCPF,
  validateCNPJ,
  validateState,
  validatePhone,
  generateKey,
} from '../validation/backValidation';

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
      sendNewUserEmail();
    } else {
      sendProjectNotificationEmail();
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
    projects = await Project.find().byEmail(email).select('_id name files');
  } catch (err) {
    if (err) {
      throw new Error('ERN0P7');
    }
  }
  return projects;
}

export async function addFileToProject(_id, file) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P8');
  }

  try {
    let project = await Project.findById(_id);

    if (project.files) {
      project.files = [...project.files, file];
    } else {
      project.files = [file];
    }

    const saved = await project.save();
    return {
      _id: saved._id,
      name: saved.name,
      newFile: {
        _id: saved.files[saved.files.length - 1]._id,
        name: saved.files[saved.files.length - 1].name,
        size: saved.files[saved.files.length - 1].size,
        key: saved.files[saved.files.length - 1].key,
      },
    };
  } catch (err) {
    console.log(err);
    throw new Error('ERN0P9');
  }
}

export async function removeFileFromProject(projId, fileId) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P10');
  }

  try {
    let returnFile = null;
    let project = await Project.findById(projId);
    let newFiles = [];
    for (let i = 0; i < project.files.length; i++) {
      const file = project.files[i];
      if (file._id.toString() !== fileId) {
        newFiles.push(file);
      } else {
        returnFile = file;
      }
    }
    project.files = newFiles;
    await project.save();
    return returnFile;
  } catch (err) {
    if (err) {
      throw new Error('ERN0P11');
    }
  }
}

export async function deleteProject(projId, email) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P12: ' + err.message);
  }

  try {
    let user;
    const projs = await getProjectsByClientEmail(email);
    const proj = await Project.findByIdAndRemove(projId);
    if (projs.length === 1) {
      user = await deletetUser(projs.client._id.toString());
    }
    return { proj, user };
  } catch (err) {
    throw new Error('ERN0P13: ' + err.message);
  }
}

export async function getProjectById(projId) {
  let project = null;
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P14');
  }

  try {
    project = await Project.findById(projId).select(
      '_id name clientFirstName clientLastName clientEmail clientCpfCnpj clientPhone address1 address2 city state cep createdOn files'
    );
  } catch (err) {
    if (err) {
      throw new Error('ERN0P15');
    }
  }
  return project;
}
