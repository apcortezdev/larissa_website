import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import s3Object from './s3';

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
  s3: multerS3({
    s3: s3Object(),
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // acl: 'public-read',
    metadata: function (req, file, cb) {
      const meta = Object.assign({}, req.body);
      meta.fileName = file.originalname;
      cb(null, meta);
    },
    key: (req, file, cb) => {
      const fileName = `${generateKey(10)}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
};

var upload = multer({
  dest: path.resolve(process.cwd(), 'public', 'tempFiles'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

export default upload;
