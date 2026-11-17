const express = require("express");
const path = require("node:path");
const parentDir = require("./utils/path.cjs");
const app = express();
const transactionsRouter = require("./routes/transactions.cjs");
const categoriesRouter = require("./routes/categories.cjs");
const authRouter = require("./routes/auth.cjs");
const { notFound, errorHandler } = require("./controllers/errors.cjs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/transactions", transactionsRouter);
app.use("/categories", categoriesRouter);
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "Expense Tracker",
    activePage: "home",
  });
});
app.get("/add-transaction", (req, res) => {
  res.render("add-transaction", {
    pageTitle: "Add Transaction",
    activePage: "add-transaction",
  });
});
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});
app.get("/budgets", (req, res) => {
  res.send("Monthly Budgets");
});
app.use(notFound);
app.use(errorHandler);
app.listen(3000, () => {
  console.log("Express Server Running");
});
