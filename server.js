import "dotenv/config";
import express from "express";

import transactionsRouter from "./routes/transactions.js";
import categoriesRouter from "./routes/categories.js";
import authRouter from "./routes/auth.js";

import { notFound, errorHandler } from "./controllers/errors.js";
import protect from "./middlewares/auth.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/transactions", protect, transactionsRouter);
app.use("/categories", protect, categoriesRouter);
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
