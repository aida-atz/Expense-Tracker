const AppError = require("../utils/AppError.cjs");
const {
  getAllTransactions,
  removeTransaction,
  getTransactionById,
  updateTransactionById,
  createTransaction,
} = require("../models/transactions.cjs");
const { validateActiveCategory } = require("./categories.cjs");
async function getTransactionsService(type, userId) {
  const transactions = await getAllTransactions(type, userId);
  return transactions;
}
async function getTransactionService(transactionId, userId) {
  const transaction = await getTransactionById(transactionId, userId);
  if (!transaction) {
    throw new AppError("Transaction not found.", 404);
  }
  return transaction;
}
async function addTransactionService(amount, categoryId, description, userId) {
  if (categoryId) await validateActiveCategory(categoryId);
  const transaction = await createTransaction(
    amount,
    categoryId,
    description,
    userId,
  );
  return transaction;
}
async function deleteTransactionService(transactionId, userId) {
  const removedtransaction = await removeTransaction(transactionId, userId);
  return removedtransaction;
}
async function updateTransactionService(
  categoryId,
  transactionId,
  amount,
  description,
  userId,
) {
  if (categoryId !== undefined) {
    await validateActiveCategory(categoryId);
  }
  const data = {
    ...(amount !== undefined && { amount }),
    ...(categoryId !== undefined && { categoryId }),
    ...(description !== undefined && { description }),
  };
  const updatedTransaction = await updateTransactionById(
    transactionId,
    data,
    userId,
  );
  return updatedTransaction;
}
module.exports = {
  getTransactionsService,
  getTransactionService,
  addTransactionService,
  deleteTransactionService,
  updateTransactionService,
};
