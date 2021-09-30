const states = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePasswordSize = (pass) => {
  if (pass.toString().length < 6 || pass.toString().length > 24) {
    return false;
  }
  return true;
};

const validatePasswordLength = (pass) => {
  if (pass.toString().length < 6 || pass.toString().length > 24) {
    return false;
  }
  return true;
};

const validatePasswordStrength = (pass) => {
  if (!/[^a-z]/gi.test(pass)) return false;

  return true;
};

const validateCPF = (cpf) => {
  const regex = /^(?:(\d)\1{10})$|(\D)|^(\d{12,})$|^(\d{0,10})$/g;
  if (cpf.length !== 11) return false;
  if (/[^0-9]/g.test(cpf)) return false;
  if (cpf.match(regex)) return false;
  let sum = 0,
    rest = 0;

  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(10, 11))) return false;

  return true;
};

const validateIsValidName = (name) => {
  return !/[^a-z\s]/gi.test(name);
};

const validatePhone = (phone) => {
  if (phone.length !== 10 && phone.length !== 11) return false;
  return true;
};

const validateState = (state) => {
  if (state in states) return true;
  return false;
};

const generateKey = async (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export {
  validateEmail,
  validatePasswordSize,
  validateCPF,
  validatePasswordLength,
  validatePasswordStrength,
  validateIsValidName,
  validatePhone,
  validateState,
  generateKey,
};
