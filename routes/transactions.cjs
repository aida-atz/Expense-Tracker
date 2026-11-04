const express = require("express");
const router = express.Router();
const transactions = [];

router.get("/", (req, res) => {
  res.json(transactions);
});
router.post("/", (req, res) => {
  console.log(req.body.amount, req.body.category);
  transactions.push({
    amount: req.body.amount,
    category: req.body.category,
  });
  res.send("Transaction Received");
});
router.get("/view", (req, res) => {
  res.render("transactions", {
    pageTitle: "Transactions",
    transactions,
    activePage: "transactions",
  });
});
module.exports = router;
