import prisma from "../config/prisma.js";
export async function getAllTransactions(type, userId) {
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(type && {
        category: {
          is: { type },
        },
      }),
    },
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
