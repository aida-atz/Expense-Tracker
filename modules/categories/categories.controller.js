import {
  changeCategoryArchiveStatus,
  updateCategoryService,
  addCategoryService,
  getCategoriesService,
  getCategoryService,
} from "./categories.service.js";
export async function getCategories(req, res) {
  const userId = req.user.id;
  const categories = await getCategoriesService(userId);
  res.status(200).json({ status: "success", data: { categories } });
}
export async function addCategory(req, res) {
  const { name, type } = req.body;
  const userId = req.user.id;
  const category = await addCategoryService(name, type, userId);
  res.status(201).json({ status: "success", data: { category } });
}
export async function archiveCategory(req, res) {
  const categoryId = req.params.id;
  const userId = req.user.id;
  const archivedCategory = await changeCategoryArchiveStatus(
    categoryId,
    true,
    userId,
  );
  res.status(200).json({ status: "success", data: { archivedCategory } });
}
export async function unarchiveCategory(req, res) {
  const categoryId = req.params.id;
  const userId = req.user.id;
  const unarchivedCategory = await changeCategoryArchiveStatus(
    categoryId,
    false,
    userId,
  );
  res.status(200).json({ status: "success", data: { unarchivedCategory } });
}
export async function getCategory(req, res) {
  const userId = req.user.id;
  const category = await getCategoryService(req.params.id, userId);
  res.status(200).json({ status: "success", data: { category } });
}
export async function updateCategory(req, res) {
  const categoryId = req.params.id;
  const userId = req.user.id;
  const { name } = req.body;
  const updatedCategory = await updateCategoryService(
    categoryId,
    { name },
    userId,
  );
  res
    .status(200)
    .json({ status: "success", data: { category: updatedCategory } });
}
