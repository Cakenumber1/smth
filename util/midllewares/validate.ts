import { NextApiRequest, NextApiResponse } from 'next';

const validateData = (req: NextApiRequest) => {
  const { mail, username, password } = req.body;
  if (!mail || !password) {
    return 'Not all required data was provided';
  }
  const regMail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!mail.toLowerCase().match(regMail)) {
    return 'Email doesn\'t match conditions';
  }
  if (username && !username.trim().length) {
    return 'Name cannot be empty';
  }
  const regPass = /^[A-Za-z]\w{7,14}$/;
  if (!password.match(regPass)) {
    return 'Password doesn\'t match conditions';
  }
  return null;
};
const validate = (handler: any) => (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.authorization?.split(' ')[1]) {
    req.body = { ...req.body, validate: validateData(req) };
  }
  return handler(req, res);
};

export default validate;
