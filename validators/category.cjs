const { body, param } = require("express-validator");
const categoryIdValidator = [
  param("id").isUUID().withMessage("Invalid category id."),
];
const addCategoryValidator = [
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Invalid transaction type"),
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .isLength({ max: 20 })
    .withMessage("Name is too long."),
];
module.exports = { categoryIdValidator, addCategoryValidator };
