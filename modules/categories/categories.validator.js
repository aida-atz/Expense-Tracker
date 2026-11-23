import { body, param, checkExact } from "express-validator";
export const categoryIdValidator = [
  param("id").isUUID().withMessage("Invalid category id."),
];
export const addCategoryValidator = [
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Invalid transaction type"),
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .isLength({ max: 20 })
    .withMessage("Name is too long."),
];
export const updateCategoryValidator = checkExact(
  [
    body("name")
      .exists()
      .withMessage("Name is required")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ max: 20 })
      .withMessage("Name must not exceed 20 characters"),
  ],
  {
    locations: ["body"],
    message: "Unknown fields are not allowed",
  },
);
