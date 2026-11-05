const express = require("express");
const path = require("node:path");
const parentDir = require("./utils/path.cjs");
const app = express();
const transactionsRouter = require("./routes/transactions.cjs");
const { engine } = require("express-handlebars");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b,
    },
  }),
);
app.set("view engine", "hbs");
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
app.get("/test-hbs", (req, res) => {
  res.render("handlebars-demo", {
    pageTitle: "Handlebars in Expense Tracker",
  });
});
app.use((req, res) => {
  res.status(404);
  res.render("404", {
    pageTitle: "",
  });
});
app.listen(3000, () => {
  console.log("Express Server Running");
});
