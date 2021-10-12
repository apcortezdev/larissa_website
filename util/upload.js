import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

const generateKey = (length) => {
  var result = '2';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length - 1; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// const s3 = new aws.S3({
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(process.cwd(), 'public', 'tempFiles'));
    },
    filename: (req, file, cb) => {
      file.key = `${generateKey(20)}-${file.originalname}`;
      cb(null, file.key);
    },
  }),
  //   s3: multerS3({
  //     s3: s3,
  //     bucket: process.env.AWS_BUCKET,
  //     acl: 'public-read',
  //     contentType: multerS3.AUTO_CONTENT_TYPE,
  //     metadata: function (req, file, cb) {
  //       cb(null, { fieldName: file.fieldname });
  //     },
  //     key: (req, file, cb) => {
  //       const fileName = `${generateKey(10)}-${file.originalname}`;
  //       cb(null, fileName);
  //     },
  //   }),
};

var upload = multer({
  dest: path.resolve(process.cwd(), 'public', 'tempFiles'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

export default upload;
