import { body, checkExact } from "express-validator";
export const registerValidator = checkExact([
  body("email")
    .exists()
    .withMessage("Emails is required")
    .bail()
    .isEmail()
    .withMessage("Email is not valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 12, max: 128 })
    .withMessage("Password must be 12–128 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^a-zA-Z0-9\s]/)
    .withMessage("Password must contain at least one special character"),
]);
export const loginValidator = checkExact([
  body("email")
    .exists()
    .withMessage("Email is Required.")
    .bail()
    .isEmail()
    .withMessage("Email is not valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .bail(),
]);

