const {
  createTransaction,
  getAllTransactions,
  removeTransaction,
} = require("../models/transactions.cjs");
const AppError = require("../utils/AppError.cjs");
async function addTransaction(req, res) {
  const { amount, type, categoryId, description } = req.body;
  const validTypes = ["EXPENSE", "INCOME"];
  if (!validTypes.includes(type)) {
    const error = new AppError("Type is invalid", 400);
    throw error;
  }
  if (
    typeof amount !== "number" ||
    amount <= 0 ||
    !Number.isFinite(amount) ||
    amount > 9999999999.99 ||
    !/^\d{1,10}(\.\d{1,2})?$/.test(amount)
  ) {
    const error = new AppError("Amount is invalid", 400);
    throw error;
  }

  const transaction = await createTransaction(
    amount,
    type,
    categoryId,
    description,
  );
  res.status(201).json(transaction);
}
async function getTransactions(req, res) {
  const transactions = await getAllTransactions();
  res.json(transactions);
}
async function deleteTransaction(req, res) {
  const { transactionId } = req.body;
  const transaction = await removeTransaction(transactionId);
  console.log(transaction);
  res.status(200).json(transaction);
}
module.exports = { addTransaction, getTransactions, deleteTransaction };
