import AppError from "../../utils/AppError.js";
import {
  setCategoryArchived,
  updateCategoryById,
  createCategory,
  getAllCategories,
  getCategoryById,
} from "./categories.repository.js";
export async function validateActiveCategory(categoryId, userId) {
  const category = await getCategoryById(categoryId, userId);
  if (!category) {
    throw new AppError("Category not found.", 404);
  }
  if (category.isArchived) {
    throw new AppError("Category is archived", 409);
  }
}
export async function changeCategoryArchiveStatus(
  categoryId,
  isArchived,
  userId,
) {
  const category = await getCategoryById(categoryId, userId);
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
  return setCategoryArchived(categoryId, isArchived, userId);
}
export async function updateCategoryService(categoryId, data, userId) {
  const category = await getCategoryById(categoryId, userId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  if (category.isDefault) {
    throw new AppError("Default categories cannot be updated", 403);
  }

  if (category.isArchived) {
    throw new AppError("Archived categories cannot be updated", 409);
  }
  const updatedCategory = await updateCategoryById(
    categoryId,
    {
      name: data.name.trim(),
    },
    userId,
  );
  return updatedCategory;
}
export async function addCategoryService(name, type, userId) {
  const category = await createCategory(name, type, userId);
  return category;
}
export async function getCategoriesService(userId) {
  const categories = await getAllCategories(userId);
  return categories;
}
export async function getCategoryService(categoryId, userId) {
  const category = await getCategoryById(categoryId, userId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
}
