import { rateLimit } from "express-rate-limit";
function createRateLimiter({ limit, message, windowMs = 15 * 60 * 1000 }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      status: "fail",
      message,
    },
  });
}
export const authLimiter = createRateLimiter(
  5,
  "Too many requests. Please try again later.",
);
export const apiLimiter = createRateLimiter(
  100,
  "API rate limit exceeded. Please try again later.",
);
