import express from "express";
import corsMiddleware from "./middlewares/cors.js";
import { authRouter } from "./modules/auth/index.js";
import { categoriesRouter } from "./modules/categories/index.js";
import { transactionsRouter } from "./modules/transactions/index.js";
import helmet from "helmet";
import protect from "./middlewares/auth.js";
import { notFound, errorHandler } from "./controllers/errors.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(corsMiddleware);
app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);

app.use("/categories", protect, categoriesRouter);

app.use("/transactions", protect, transactionsRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
