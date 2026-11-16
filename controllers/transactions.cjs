const {
  getTransactionsService,
  getTransactionService,
  addTransactionService,
  deleteTransactionService,
  updateTransactionService,
} = require("../services/transactions.cjs");
async function addTransaction(req, res) {
  const { amount, categoryId, description } = req.body;
  const transaction = await addTransactionService(
    amount,
    categoryId,
    description,
  );
  res.status(201).json({
    status: "success",
    data: { transaction },
  });
}
async function getTransactions(req, res) {
  const { type } = req.query;
  const transactions = await getTransactionsService(type);
  res.status(200).json({
    status: "success",
    data: {
      transactions,
    },
  });
}
async function deleteTransaction(req, res) {
  const transactionId = req.params.id;
  const transaction = await deleteTransactionService(transactionId);
  res.status(200).json({ status: "success", data: { transaction } });
}
async function getTransaction(req, res) {
  const transactionId = req.params.id;
  const transaction = await getTransactionService(transactionId);
  res.status(200).json({ status: "success", data: { transaction } });
}
async function updateTransaction(req, res) {
  const transactionId = req.params.id;
  const { amount, categoryId, description } = req.body;
  const updatedTransaction = await updateTransactionService(
    categoryId,
    transactionId,
    amount,
    description,
  );
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
