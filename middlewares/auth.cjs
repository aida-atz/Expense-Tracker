const jwt = require("jsonwebtoken");
require("dotenv/config");
const AppError = require("../utils/AppError.cjs");
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Authentication required", 401));
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return next(new AppError("Invalid authorization header", 401));
  }

  const token = parts[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (err) {
    if (
      err.name === "TokenExpiredError" ||
      err.name === "JsonWebTokenError" ||
      err.name === "NotBeforeError"
    ) {
      return next(new AppError("Invalid or expired token", 401));
    }

    return next(err);
  }

  if (
    !decoded ||
    typeof decoded !== "object" ||
    typeof decoded.sub !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      decoded.sub,
    )
  ) {
    return next(new AppError("Invalid token payload", 401));
  }

  req.user = {
    id: decoded.sub,
  };

  next();
}
module.exports = protect;
