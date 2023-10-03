import { Router } from "express";
import * as authController from "./auth.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
import { catchError } from "../../utils/errorHandling.js";
const authRouter = Router();

authRouter.post(
  "/signup",
  validation(validators.signUpSchema),
  catchError(authController.signUp)
);

authRouter.get(
  "/confirmEmail/:token",
  validation(validators.confirmEmail),
  catchError(authController.confirmEmail)
);

authRouter.get(
  "/newConfirmEmail/:token",
  validation(validators.newConfirmEmail),
  catchError(authController.newConfirmEmail)
);

authRouter.post(
  "/signin",
  validation(validators.signInSchema),
  catchError(authController.signIn)
);

export default authRouter;
