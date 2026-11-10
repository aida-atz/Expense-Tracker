const {
  categoryIdValidator,
  addCategoryValidator,
} = require("../validators/category.cjs");
const validateRequest = require("../middlewares/validateRequest.cjs");
const express = require("express");

const router = express.Router();
const {
  getCategories,
  addCategory,
  deleteCategory,
  getCategory,
} = require("../controllers/categories.cjs");
router.get("/", getCategories);
router.post("/", addCategoryValidator, validateRequest, addCategory);
router.delete("/:id", categoryIdValidator, validateRequest, deleteCategory);
router.get("/:id", categoryIdValidator, validateRequest, getCategory);
module.exports = router;
