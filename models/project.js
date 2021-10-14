import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import s3Object from '../util/s3';

const Schema = mongoose.Schema;

const s3 = s3Object();

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
  createdOn: {
    type: Date,
    default: new Date(),
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

project.pre('findByIdAndRemove', function () {
  console.log('removing')
  const proms = [];
  if (process.env.STORAGE_TYPE === 's3') {
    this.files.forEach((file) => {
      proms.push(
        s3
          .deleteObject({ Bucket: process.env.AWS_BUCKET, Key: file.key })
          .promise()
      );
    });
  } else {
    this.files.forEach((file) => {
      proms.push(
        promisify(fs.unlink)(
          path.resolve(process.cwd(), 'public', 'tempFiles', file.key)
        )
      );
    });
  }
  Promise.all(proms).then(() => {
    return;
  });
});

export default mongoose.models.Project || mongoose.model('Project', project);
