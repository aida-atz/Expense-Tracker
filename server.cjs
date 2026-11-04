const express = require("express");
const path = require("node:path");
const parentDir = require("./utils/path.cjs");
const app = express();
const transactionsRouter = require("./routes/transactions.cjs");
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: false }));
// Use express.static middleware to serve static files from the "public" folder
app.use(express.static(path.join(parentDir, "public")));
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});
app.use("/transactions", (req, res, next) => {
  console.log("Transactions Middleware");
  next();
});
app.use("/transactions", transactionsRouter);

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
  console.log("After Transactions Route");
  next();
});
app.get("/budgets", (req, res) => {
  res.send("Monthly Budgets");
});

app.use((req, res, next) => {
  res.status(404);
  const filePath = path.join(parentDir, "views", "404.html");
  res.sendFile(filePath);
});
app.listen(3000, () => {
  console.log("Express Server Running");
});
