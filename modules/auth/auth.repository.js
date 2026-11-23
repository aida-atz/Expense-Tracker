import prisma from "../../config/prisma.js";
export async function createUser(email, passwordHash) {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
}
export async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
