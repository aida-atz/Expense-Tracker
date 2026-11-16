const {
  changeCategoryArchiveStatus,
  updateCategoryService,
  addCategoryService,
  getCategoriesService,
  getCategoryService,
} = require("../services/categories.cjs");

async function getCategories(req, res) {
  const categories = await getCategoriesService();
  res.status(200).json({ status: "success", data: { categories } });
}
async function addCategory(req, res) {
  const { name, type } = req.body;
  const category = await addCategoryService(name, type);
  res.status(201).json({ status: "success", data: { category } });
}
async function archiveCategory(req, res) {
  const categoryId = req.params.id;
  const archivedCategory = await changeCategoryArchiveStatus(categoryId, true);
  res.status(200).json({ status: "success", data: { archivedCategory } });
}
async function unarchiveCategory(req, res) {
  const categoryId = req.params.id;
  const unarchivedCategory = await changeCategoryArchiveStatus(
    categoryId,
    false,
  );
  res.status(200).json({ status: "success", data: { unarchivedCategory } });
}
async function getCategory(req, res) {
  const category = await getCategoryService(req.params.id);
  res.status(200).json({ status: "success", data: { category } });
}
async function updateCategory(req, res) {
  const categoryId = req.params.id;
  const { name } = req.body;
  const updatedCategory = await updateCategoryService(categoryId, { name });
  res
    .status(200)
    .json({ status: "success", data: { category: updatedCategory } });
}
module.exports = {
  getCategories,
  addCategory,
  archiveCategory,
  getCategory,
  updateCategory,
  unarchiveCategory,
};
