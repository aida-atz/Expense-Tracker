import {
  addCategoryValidator,
  categoryIdValidator,
  updateCategoryValidator,
} from "../validators/category.js";
import {
  addCategory,
  archiveCategory,
  getCategory,
  updateCategory,
  unarchiveCategory,
  getCategories,
} from "../controllers/categories.js";
import validateRequest from "../middlewares/validateRequest.js";
import express from "express";
const router = express.Router();
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
export default router;
