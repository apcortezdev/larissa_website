import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

const recoveryLogSchema = new Schema({
  country_code: {
    type: String,
    required: true,
  },
  country_name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postal: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  IPv4: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  requestedOn: {
    type: Date,
    required: true,
  },
  recoveredOn: {
    type: Date,
    required: false,
  },
});

const project = new Schema({
  name: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cpf_cnpj: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  lastAccess: {
    type: Date,
    default: new Date(),
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  lastRecoveryString: {
    type: String,
    required: true,
  },
  lastRecoveryTime: {
    type: Date,
    required: false,
  },
  lastRecoveryActive: {
    type: Date,
    required: false,
  },
  recoveryLogs: [recoveryLogSchema],
  files: [fileSchema],
});

project.query.byEmail = function (email) {
  return this.where({ email: email, active: true });
};

export default mongoose.models.Project || mongoose.model('Project', project);
