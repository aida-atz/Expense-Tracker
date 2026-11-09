const prisma = require("../config/prisma.cjs");
async function getAllTransactions() {
  const transactions = await prisma.transaction.findMany();
  return transactions;
}
async function createTransaction(amount, type, categoryId, description) {
  const transaction = await prisma.transaction.create({
    data: { amount, type, categoryId, description },
  });
  return transaction;
}
async function removeTransaction(transactionId) {
  const transaction = await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
  return transaction;
}
module.exports = { getAllTransactions, createTransaction, removeTransaction };
