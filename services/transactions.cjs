const AppError = require("../utils/AppError.cjs");
const {
  getAllTransactions,
  removeTransaction,
  getTransactionById,
  updateTransactionById,
  createTransaction,
} = require("../models/transactions.cjs");
const { validateActiveCategory } = require("./categories.cjs");
async function getTransactionsService(type) {
  const transactions = await getAllTransactions(type);
  return transactions;
}
async function getTransactionService(transactionId) {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new AppError("Transaction not found.", 404);
  }
  return transaction;
}
async function addTransactionService(amount, categoryId, description) {
  if (categoryId) await validateActiveCategory(categoryId);
  const transaction = await createTransaction(amount, categoryId, description);
  return transaction;
}
async function deleteTransactionService(transactionId) {
  const removedtransaction = await removeTransaction(transactionId);
  return removedtransaction;
}
async function updateTransactionService(
  categoryId,
  transactionId,
  amount,
  description,
) {
  if (categoryId !== undefined) {
    await validateActiveCategory(categoryId);
  }
  const data = {
    ...(amount !== undefined && { amount }),
    ...(categoryId !== undefined && { categoryId }),
    ...(description !== undefined && { description }),
  };
  const updatedTransaction = await updateTransactionById(transactionId, data);
  return updatedTransaction;
}
module.exports = {
  getTransactionsService,
  getTransactionService,
  addTransactionService,
  deleteTransactionService,
  updateTransactionService,
};
