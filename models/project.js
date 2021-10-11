import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const project = new Schema({
  name: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientFirstName: {
    type: String,
    required: true,
  },
  clientLastName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  clientCpfCnpj: {
    type: String,
    required: true,
  },
  clientPhone: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: false,
  },
  address2: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  cep: {
    type: String,
    required: false,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  files: [fileSchema],
});

project.query.byEmail = function (email) {
  return this.where({ clientEmail: email });
};

export default mongoose.models.Project || mongoose.model('Project', project);
