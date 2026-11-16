const AppError = require("../utils/AppError.cjs");
const {
  setCategoryArchived,
  updateCategoryById,
  createCategory,
  getAllCategories,
  getCategoryById,
} = require("../models/category.cjs");
async function validateActiveCategory(categoryId) {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new AppError("Category not found.", 404);
  }
  if (category.isArchived) {
    throw new AppError("Category is archived", 409);
  }
}
async function changeCategoryArchiveStatus(categoryId, isArchived) {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  if (category.isDefault) {
    throw new AppError(
      "Default categories cannot be archived or unarchived",
      403,
    );
  }
  if (category.isArchived === isArchived) {
    throw new AppError("Category already has this archive status", 409);
  }
  return setCategoryArchived(categoryId, isArchived);
}
async function updateCategoryService(categoryId, data) {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  if (category.isDefault) {
    throw new AppError("Default categories cannot be updated", 403);
  }

  if (category.isArchived) {
    throw new AppError("Archived categories cannot be updated", 409);
  }
  const updatedCategory = await updateCategoryById(categoryId, {
  name: data.name.trim(),
});
  return updatedCategory;
}
async function addCategoryService(name, type) {
  const category = await createCategory(name, type);
  return category;
}
async function getCategoriesService() {
  const categories = await getAllCategories();
  return categories;
}
async function getCategoryService(categoryId) {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
}
module.exports = {
  validateActiveCategory,
  changeCategoryArchiveStatus,
  updateCategoryService,
  addCategoryService,
  getCategoriesService,
  getCategoryService,
};
