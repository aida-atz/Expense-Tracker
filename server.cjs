const express = require("express");
const path = require("node:path");
const parentDir = require("./utils/path.cjs");
const app = express();
const transactionsRouter = require("./routes/transactions.cjs");
const categoriesRouter = require("./routes/categories.cjs");
const { notFound, errorHandler } = require("./controllers/errors.cjs");
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
app.use(express.json());
app.use("/transactions", transactionsRouter);
app.use("/categories", categoriesRouter);
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
app.get("/test-ejs", (req, res) => {
  res.render("ejs-demo.ejs", {
    pageTitle: "EJS Test",
    categories: [
      {
        id: 1,
        name: "food",
      },
      {
        id: 2,
        name: "services",
      },
    ],
  });
});
app.use(notFound);
app.use(errorHandler);
app.listen(3000, () => {
  console.log("Express Server Running");
});
