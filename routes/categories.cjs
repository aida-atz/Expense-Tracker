const {
  categoryIdValidator,
  addCategoryValidator,
  updateCategoryValidator,
} = require("../validators/category.cjs");
const validateRequest = require("../middlewares/validateRequest.cjs");
const express = require("express");

const router = express.Router();
const {
  getCategories,
  addCategory,
  archiveCategory,
  getCategory,
  updateCategory,
  unarchiveCategory,
} = require("../controllers/categories.cjs");
router.get("/", getCategories);
router.post("/", addCategoryValidator, validateRequest, addCategory);
router.patch("/:id", categoryIdValidator, validateRequest, archiveCategory);
router.get("/:id", categoryIdValidator, validateRequest, getCategory);
router.patch("/:id", updateCategory, validateRequest, updateCategoryValidator);
router.patch(
  "/:id/unarchive",
  categoryIdValidator,
  validateRequest,
  unarchiveCategory,
);
module.exports = router;
