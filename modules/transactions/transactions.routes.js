import express from "express";
const router = express.Router();
import {
  addTransactionValidator,
  transactionIdValidator,
  transactionQueryValidator,
  updateTransactionValidator,
} from "./transactions.validator.js";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "./transactions.controller.js";

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
