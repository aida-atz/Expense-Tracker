const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
} = require("../controllers/transactions.cjs");

router.get("/", getTransactions);
router.post("/", addTransaction);
router.delete("/", deleteTransaction);

module.exports = router;
