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
async function removeCategory(categoryId) {
  const category = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
  return category;
}
async function getCategoryById(categoryId) {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      transactions: true,
    },
  });
  return category;
}
module.exports = {
  getAllCategories,
  createCategory,
  removeCategory,
  getCategoryById,
};
