const {
  getAllCategories,
  createCategory,
  removeCategory,
} = require("../models/category.cjs");
const AppError = require("../utils/AppError.cjs");
async function getCategories(req, res) {
  const categories = await getAllCategories();
  res.status(200).json(categories);
}
async function addCategory(req, res) {
  const { name, type } = req.body;
  const validTypes = ["EXPENSE", "INCOME"];
  if (typeof name !== "string" || !name.trim().length) {
    const error = new AppError("Invalid Name", 400);

    throw error;
  }
  if (!validTypes.includes(type)) {
    const error = new AppError("Invalid Type", 400);

    throw error;
  }
  const trimmedName = name.trim();
  const category = await createCategory(trimmedName, type);
  res.status(201).json(category);
}
async function deleteCategory(req, res) {
  console.log(req);

  const { categoryId } = req.body;
  const category = await removeCategory(categoryId);
  res.status(200).json({ status: "success", data: { category } });
}
module.exports = { getCategories, addCategory, deleteCategory };
