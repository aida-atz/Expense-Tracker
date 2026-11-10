const {
  createTransaction,
  getAllTransactions,
  removeTransaction,
  getTransactionById,
  updateTransactionById,
} = require("../models/transactions.cjs");
const AppError = require("../utils/AppError.cjs");
async function addTransaction(req, res) {
  const { amount, categoryId, description } = req.body;
  const transaction = await createTransaction(amount, categoryId, description);
  res.status(201).json(transaction);
}
async function getTransactions(req, res) {
  const { type } = req.query;
  const transactions = await getAllTransactions(type);
  res.status(200).json({
    status: "success",
    data: {
      transactions,
    },
  });
}
async function deleteTransaction(req, res) {
  const transactionId = req.params.id;
  const transaction = await removeTransaction(transactionId);
  console.log(transaction);
  res.status(200).json({ status: "success", data: { transaction } });
}
async function getTransaction(req, res) {
  const transactionId = req.params.id;
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    const error = new AppError("Transaction not found.", 404);
    throw error;
  }
  res.status(200).json({ status: "success", data: { transaction } });
}
async function updateTransaction(req, res) {
  const transactionId = req.params.id;
  const { amount, categoryId, description } = req.body;

  const data = {
    ...(amount !== undefined && { amount }),
    ...(categoryId !== undefined && { categoryId }),
    ...(description !== undefined && { description }),
  };
  const updatedTransaction = await updateTransactionById(transactionId, data);
  res
    .status(200)
    .json({ status: "success", data: { transaction: updatedTransaction } });
}
module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getTransaction,
  updateTransaction,
};
