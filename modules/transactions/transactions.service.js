import AppError from "../../utils/AppError.js";
import {
  getAllTransactions,
  removeTransaction,
  getTransactionById,
  updateTransactionById,
  createTransaction,
  countTransactions,
  getTotalIncome,
  getTotalExpense,
} from "./transactions.repository.js";
import { validateActiveCategory } from "../categories/index.js";
import Decimal from "decimal.js";
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
export async function getSummaryService(userId) {
  const [incomeResult, expenseResult] = await Promise.all([
    getTotalIncome(userId),
    getTotalExpense(userId),
  ]);
  const totalIncome = new Decimal(incomeResult._sum.amount ?? 0);
  const totalExpense = new Decimal(expenseResult._sum.amount ?? 0);
  const balance = totalIncome.minus(totalExpense);
  return {
    totalIncome: totalIncome.toFixed(2),
    totalExpense: totalExpense.toFixed(2),
    balance: balance.toFixed(2),
  };
}
