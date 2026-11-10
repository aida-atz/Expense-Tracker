const prisma = require("../config/prisma.cjs");
async function getAllTransactions(type) {
  return prisma.transaction.findMany({
    where: type
      ? {
          category: {
            is: {
              type,
            },
          },
        }
      : {},
  });
}
async function createTransaction(amount, categoryId, description) {
  return prisma.transaction.create({
    data: { amount, categoryId, description },
  });
}
async function removeTransaction(transactionId) {
  return prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
}
async function getTransactionById(transactionId) {
  return prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  });
}
async function updateTransactionById(transactionId, data) {
  return prisma.transaction.update({
    where: {
      id: transactionId,
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
