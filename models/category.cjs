const prisma = require("../config/prisma.cjs");
async function getAllCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}
async function createCategory(name, type) {
  const category = await prisma.category.create({
    data: { name, type },
  });
  return category;
}
async function setCategoryArchived(categoryId, isArchived) {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isArchived,
    },
  });
}
async function getCategoryById(categoryId, withTransactions = false) {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },

    include: {
      ...(withTransactions && { transaction: true }),
    },
  });
  return category;
}
async function updateCategoryById(categoryId, data) {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });
}

module.exports = {
  getAllCategories,
  createCategory,
  setCategoryArchived,
  getCategoryById,
  updateCategoryById,
};
