import joi from "joi";
import { generalFeilds } from "../../middleware/validation.js";

export const signUpSchema = joi
  .object({
    userName: generalFeilds.userName,
    password: generalFeilds.password,
    email: generalFeilds.email,
    cPassword: generalFeilds.cPassword.valid(joi.ref("password")),
    age: generalFeilds.age,
    role: generalFeilds.role,
  })
  .required();

export const signInSchema = joi
  .object({
    password: generalFeilds.password,
    email: generalFeilds.email,
  })
  .required();

export const confirmEmail = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const newConfirmEmail = joi
  .object({
    token: joi.string().required(),
  })
  .required();
