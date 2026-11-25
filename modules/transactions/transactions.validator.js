import { body, param, query } from "express-validator";
const validTypes = ["INCOME", "EXPENSE"];

export const transactionIdValidator = [
  param("id").isUUID().withMessage("Invalid transaction ID"),
];
export const addTransactionValidator = [
  body("amount")
    .isFloat({ gt: 0, max: 9999999999.99 })
    .withMessage("Invalid amount"),
  body("categoryId").isUUID().withMessage("Invalid category ID"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description is too long"),
];
export const transactionQueryValidator = [
  query("type")
    .optional()
    .isIn(validTypes)
    .withMessage("Invalid transaction type"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("categoryId").optional().isUUID().withMessage("Invalid category ID"),
  query("startDate")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .isISO8601({ strict: true })
    .withMessage("Invalid start date"),
  query("endDate")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid end date")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("Invalid end date")
    .bail()
    .custom((endDate, { req }) => {
      const startDate = req.query.startDate;
      if (
        typeof startDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(startDate) &&
        startDate > endDate
      ) {
        throw new Error("End date must be after or equal to start date");
      }
      return true;
    }),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "amount"])
    .withMessage("Sort field must be either 'createdAt' or 'amount'"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either 'asc' or 'desc'"),
  query("search")
    .optional()
    .isString()
    .withMessage("Search query must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Search Query must not be empty")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Search query is too long."),
];
export const updateTransactionValidator = [
  body("amount")
    .optional()
    .custom((value) => {
      return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value > 0 &&
        value <= 9999999999.99 &&
        /^\d{1,10}(\.\d{1,2})?$/.test(String(value))
      );
    })
    .withMessage("Invalid amount"),
  body("categoryId").optional().isUUID().withMessage("Invalid category ID"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description is too long"),
];
