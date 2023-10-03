import jwt from "jsonwebtoken";

export const generateToken = ({
  payLoad,
  signature = process.env.SIGNATURE,
  expiresIn = 60 * 60,
} = {}) => {
  const token = jwt.sign(payLoad, signature, { expiresIn });
  return token;
};

export const verifyToken = ({
  token,
  signature = process.env.SIGNATURE,
} = {}) => {
  const decode = jwt.verify(token, signature);
  return decode;
};
