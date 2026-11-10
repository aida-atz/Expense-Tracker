const {
  getAllCategories,
  createCategory,
  removeCategory,
  getCategoryById,
} = require("../models/category.cjs");
const AppError = require("../utils/AppError.cjs");
async function getCategories(req, res) {
  const categories = await getAllCategories();
  res.status(200).json({ status: "success", data: { categories } });
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
  res.status(201).json({ status: "success", data: { category } });
}
async function deleteCategory(req, res) {
  const categoryId = req.params.id;
  const category = await removeCategory(categoryId);
  res.status(200).json({ status: "success", data: { category } });
}
async function getCategory(req, res) {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);
  res.status(200).json({ status: "success", data: { category } });
}
module.exports = { getCategories, addCategory, deleteCategory, getCategory };
