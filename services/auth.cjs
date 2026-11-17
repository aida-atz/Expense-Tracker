const AppError = require("../utils/AppError.cjs");
const { createUser } = require("../models/user.cjs");
const argon2 = require("argon2");
async function registerService(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });
  const user = await createUser(normalizedEmail, passwordHash);
  return user;
}
module.exports = {
  registerService,
};
