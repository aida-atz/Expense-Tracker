import prisma from "../../config/prisma.js";
function buildTransactionWhere(
  userId,
  type,
  categoryId,
  startDate,
  endDate,
  search,
) {
  return {
    userId,
    ...(type && {
      category: {
        is: { type },
      },
    }),
    ...(categoryId && { categoryId }),
    ...((startDate || endDate) && {
      createdAt: {
        ...(startDate && {
          gte: new Date(`${startDate}T00:00:00.000Z`),
        }),

        ...(endDate && {
          lt: new Date(
            new Date(`${endDate}T00:00:00.000Z`).getTime() +
              24 * 60 * 60 * 1000,
          ),
        }),
      },
    }),
    ...(search && { description: { contains: search, mode: "insensitive" } }),
  };
}
export async function getAllTransactions(filters) {
  const {
    type,
    categoryId,
    startDate,
    endDate,
    userId,
    skip,
    limit,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
  } = filters;
  const where = buildTransactionWhere(
    userId,
    type,
    categoryId,
    startDate,
    endDate,
    search,
  );
  return prisma.transaction.findMany({
    where,
    skip,
    take: limit,
    orderBy: [{ [sortBy]: sortOrder }, { id: "desc" }],
  });
}
export async function createTransaction(
  amount,
  categoryId,
  description,
  userId,
) {
  return prisma.transaction.create({
    data: {
      amount,
      description,
      category: {
        connect: { id: categoryId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
}
export async function removeTransaction(transactionId, userId) {
  return prisma.transaction.delete({
    where: {
      id: transactionId,
      userId,
    },
  });
}
export async function getTransactionById(transactionId, userId) {
  return prisma.transaction.findUnique({
    where: {
      id: transactionId,
      userId,
    },
  });
}
export async function updateTransactionById(transactionId, data, userId) {
  return prisma.transaction.update({
    where: {
      id: transactionId,
      userId,
    },
    data,
  });
}
export async function countTransactions(filters) {
  const { type, categoryId, startDate, endDate, userId, search } = filters;
  const where = buildTransactionWhere(
    userId,
    type,
    categoryId,
    startDate,
    endDate,
    search,
  );
  return prisma.transaction.count({
    where,
  });
}
export async function getTotalIncome(userId) {
  return prisma.transaction.aggregate({
    where: {
      userId,
      category: {
        is: { type: "INCOME" },
      },
    },
    _sum: {
      amount: true,
    },
  });
}
export async function getTotalExpense(userId) {
  return prisma.transaction.aggregate({
    where: {
      userId,
      category: {
        is: { type: "EXPENSE" },
      },
    },
    _sum: {
      amount: true,
    },
  });
}
