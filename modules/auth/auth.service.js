import AppError from "../../utils/AppError.js";
import { createUser, getUserByEmail } from "./auth.repository.js";
import argon2 from "argon2";
import { createAccessToken } from "../../utils/jwt.js";
export async function registerService(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });
  const user = await createUser(normalizedEmail, passwordHash);
  return user;
}

export async function loginService(email, password) {
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
