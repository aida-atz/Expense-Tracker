const AppError = require("../utils/AppError.cjs");
const { createUser, getUserByEmail } = require("../models/user.cjs");
const argon2 = require("argon2");
const { createAccessToken } = require("../utils/jwt.cjs");
async function registerService(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });
  const user = await createUser(normalizedEmail, passwordHash);
  return user;
}
async function loginService(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isValid = await argon2.verify(user.passwordHash, password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }
  const accessToken = createAccessToken(user.id);
  return { user: { id: user.id, email: user.email }, accessToken };
}
module.exports = {
  registerService,
  loginService,
};
