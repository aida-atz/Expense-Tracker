const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  deleteCategory,
} = require("../controllers/categories.cjs");
router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/", deleteCategory);
module.exports = router;
