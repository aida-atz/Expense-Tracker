const express = require("express");
const router = express.Router();
const {
  addTransactionValidator,
  transactionIdValidator,
  transactionQueryValidator,
  updateTransactionValidator,
} = require("../validators/transaction.cjs");
const validateRequest = require("../middlewares/validateRequest.cjs");
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} = require("../controllers/transactions.cjs");

router.get("/", transactionQueryValidator, validateRequest, getTransactions);
router.post("/", addTransactionValidator, validateRequest, addTransaction);
router.delete(
  "/:id",
  transactionIdValidator,
  validateRequest,
  deleteTransaction,
);
router.get("/:id", transactionIdValidator, validateRequest, getTransaction);
router.patch(
  "/:id",
  updateTransactionValidator,
  validateRequest,
  updateTransaction,
);
module.exports = router;
