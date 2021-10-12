import aws from 'aws-sdk';

const s3 = {};

function s3Object() {
  if (s3.isConnected) {
    return s3.connection;
  }
  s3.connection = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  s3.isConnected = true;
  return s3.connection;
}

export default s3Object;
