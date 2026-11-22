import {
  getTransactionsService,
  getTransactionService,
  addTransactionService,
  deleteTransactionService,
  updateTransactionService,
} from "../services/transactions.js";
export async function addTransaction(req, res) {
  const { amount, categoryId, description } = req.body;
  const userId = req.user.id;
  const transaction = await addTransactionService(
    amount,
    categoryId,
    description,
    userId,
  );
  res.status(201).json({
    status: "success",
    data: { transaction },
  });
}
export async function getTransactions(req, res) {
  const { type } = req.query;
  const userId = req.user.id;
  const transactions = await getTransactionsService(type, userId);
  res.status(200).json({
    status: "success",
    data: {
      transactions,
    },
  });
}
export async function deleteTransaction(req, res) {
  const transactionId = req.params.id;
  const userId = req.user.id;
  const transaction = await deleteTransactionService(transactionId, userId);
  res.status(200).json({ status: "success", data: { transaction } });
}
export async function getTransaction(req, res) {
  const transactionId = req.params.id;
  const userId = req.user.id;
  const transaction = await getTransactionService(transactionId, userId);
  res.status(200).json({ status: "success", data: { transaction } });
}
export async function updateTransaction(req, res) {
  const transactionId = req.params.id;
  const userId = req.user.id;
  const { amount, categoryId, description } = req.body;
  const updatedTransaction = await updateTransactionService(
    categoryId,
    transactionId,
    amount,
    description,
    userId,
  );
  res
    .status(200)
    .json({ status: "success", data: { transaction: updatedTransaction } });
}
