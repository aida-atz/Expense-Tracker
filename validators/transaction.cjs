const { body, param, query } = require("express-validator");
const validTypes = ["INCOME", "EXPENSE"];
const transactionIdValidator = [
  param("id").isUUID().withMessage("Invalid transaction ID"),
];
const addTransactionValidator = [
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
const transactionQueryValidator = [
  query("type")
    .optional()
    .isIn(validTypes)
    .withMessage("Invalid transaction type"),
];
const updateTransactionValidator = [
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
module.exports = {
  addTransactionValidator,
  transactionIdValidator,
  transactionQueryValidator,
  updateTransactionValidator,
};
