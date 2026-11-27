import express from "express";
import corsMiddleware from "./middlewares/cors.js";
import { authRouter } from "./modules/auth/index.js";
import { categoriesRouter } from "./modules/categories/index.js";
import { transactionsRouter } from "./modules/transactions/index.js";
import helmet from "helmet";
import protect from "./middlewares/auth.js";
import { notFound, errorHandler } from "./controllers/errors.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";
import "dotenv/config";
const app = express();
app.disable("x-powered-by");
const defaultHelmet = helmet();

const docsHelmet = helmet({
  contentSecurityPolicy: false,
});
app.use((req, res, next) => {
  const isDocs = req.path === "/api-docs" || req.path.startsWith("/api-docs/");
  return (isDocs ? docsHelmet : defaultHelmet)(req, res, next);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(corsMiddleware);
if (process.env.NODE_ENV !== "test") {
  app.use(apiLimiter);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);
app.use("/categories", protect, categoriesRouter);
app.use("/transactions", protect, transactionsRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
