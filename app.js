import express from "express";

import { authRouter } from "./modules/auth/index.js";
import { categoriesRouter } from "./modules/categories/index.js";
import { transactionsRouter } from "./modules/transactions/index.js";

import protect from "./middlewares/auth.js";
import { notFound, errorHandler } from "./controllers/errors.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);

app.use("/categories", protect, categoriesRouter);

app.use("/transactions", protect, transactionsRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
