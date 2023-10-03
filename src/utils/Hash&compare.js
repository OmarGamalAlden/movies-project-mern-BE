import bcrypt from "bcryptjs";

export const Hashing = ({ text, noRound = process.env.SALT_ROUND } = {}) => {
  const hashResult = bcrypt.hashSync(text, parseInt(noRound));
  return hashResult;
};

export const Compareing = ({ hashedValue, text } = {}) => {
  const compareResult = bcrypt.compareSync(text, hashedValue);
  return compareResult;
};
