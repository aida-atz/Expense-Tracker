import {
  getTransactionsService,
  getTransactionService,
  addTransactionService,
  deleteTransactionService,
  updateTransactionService,
  getSummaryService,
} from "./transactions.service.js";
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
  const {
    type,
    categoryId,
    startDate,
    endDate,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "10",
    search,
  } = req.query;
  const userId = req.user.id;
  const result = await getTransactionsService(
    {
      type,
      categoryId,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page: Number(page),
      limit: Number(limit),
      search,
    },
    userId,
  );
  res.status(200).json({
    status: "success",
    data: result,
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
export async function getSummary(req, res) {
  const userId = req.user.id;
  const summary = await getSummaryService(userId);
  res.status(200).json({ status: "success", data: { summary } });
}
