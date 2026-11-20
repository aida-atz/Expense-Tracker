const prisma = require("../config/prisma.cjs");
async function getAllTransactions(type, userId) {
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
async function createTransaction(amount, categoryId, description, userId) {
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
async function removeTransaction(transactionId, userId) {
  return prisma.transaction.delete({
    where: {
      id: transactionId,
      userId,
    },
  });
}
async function getTransactionById(transactionId, userId) {
  return prisma.transaction.findUnique({
    where: {
      id: transactionId,
      userId,
    },
  });
}
async function updateTransactionById(transactionId, data, userId) {
  return prisma.transaction.update({
    where: {
      id: transactionId,
      userId,
    },
    data,
  });
}
module.exports = {
  getAllTransactions,
  createTransaction,
  removeTransaction,
  getTransactionById,
  updateTransactionById,
};
