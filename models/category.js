import prisma from "../config/prisma.js";
export async function getAllCategories(userId) {
  return prisma.category.findMany({
    where: {
      OR: [
        {
          isDefault: true,
          userId: null,
        },
        {
          isDefault: false,
          userId,
        },
      ],
    },
  });
}
export async function createCategory(name, type, userId) {
  return prisma.category.create({
    data: {
      name,
      type,
      isDefault: false,
      user: {
        connect: { id: userId },
      },
    },
  });
}
export async function setCategoryArchived(categoryId, isArchived, userId) {
  if (!userId) {
    throw new Error("userId is required");
  }

  return prisma.category.update({
    where: {
      id: categoryId,
      userId,
      isDefault: false,
    },
    data: {
      isArchived,
    },
  });
}
export async function getCategoryById(
  categoryId,
  userId,
  withTransactions = false,
) {
  if (!userId) {
    throw new Error("userId is required");
  }
  return prisma.category.findUnique({
    where: {
      id: categoryId,
      OR: [
        {
          isDefault: true,
          userId: null,
        },
        {
          isDefault: false,
          userId,
        },
      ],
    },

    ...(withTransactions && {
      include: {
        transactions: {
          where: {
            userId,
          },
        },
      },
    }),
  });
}
export async function updateCategoryById(categoryId, data) {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });
}
