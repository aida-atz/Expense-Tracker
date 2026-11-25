import AppError from "../../utils/AppError.js";
import {
  getAllTransactions,
  removeTransaction,
  getTransactionById,
  updateTransactionById,
  createTransaction,
  countTransactions,
} from "./transactions.repository.js";
import { validateActiveCategory } from "../categories/index.js";
export async function getTransactionsService(filters, userId) {
  const {
    type,
    categoryId,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
    search,
  } = filters;
  const skip = (page - 1) * limit;
  const repositoryFilters = {
    userId,
    type,
    categoryId,
    startDate,
    endDate,
    search,
  };
  const [transactions, total] = await Promise.all([
    getAllTransactions({
      ...repositoryFilters,
      skip,
      limit,
      sortBy,
      sortOrder,
    }),
    countTransactions(repositoryFilters),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
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
