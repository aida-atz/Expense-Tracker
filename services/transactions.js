import AppError from "../utils/AppError.js";
import {
  getAllTransactions,
  removeTransaction,
  getTransactionById,
  updateTransactionById,
  createTransaction,
} from "../models/transactions.js";
import { validateActiveCategory } from "./categories.js";
export async function getTransactionsService(type, userId) {
  const transactions = await getAllTransactions(type, userId);
  return transactions;
}
export async function getTransactionService(transactionId, userId) {
  const transaction = await getTransactionById(transactionId, userId);
  if (!transaction) {
    throw new AppError("Transaction not found.", 404);
  }
  return transaction;
}
export async function addTransactionService(
  amount,
  categoryId,
  description,
  userId,
) {
  if (categoryId) await validateActiveCategory(categoryId, userId);
  const transaction = await createTransaction(
    amount,
    categoryId,
    description,
    userId,
  );
  return transaction;
}
export async function deleteTransactionService(transactionId, userId) {
  const removedtransaction = await removeTransaction(transactionId, userId);
  return removedtransaction;
}
export async function updateTransactionService(
  categoryId,
  transactionId,
  amount,
  description,
  userId,
) {
  if (categoryId !== undefined) {
    await validateActiveCategory(categoryId, userId);
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
