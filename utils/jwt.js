import jwt from "jsonwebtoken";
export function createAccessToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
}
