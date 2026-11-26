import express from "express";
const router = express.Router();
import {
  addTransactionValidator,
  transactionIdValidator,
  transactionQueryValidator,
  updateTransactionValidator,
  monthlyReportValidator,
} from "./transactions.validator.js";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getTransaction,
  updateTransaction,
  getSummary,
  getYearlyReport,
} from "./transactions.controller.js";
router.get("/summary", getSummary);
router.get(
  "/reports/monthly",
  monthlyReportValidator,
  validateRequest,
  getYearlyReport,
);
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

export default router;
