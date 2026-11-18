const prisma = require("../config/prisma.cjs");
async function createUser(email, passwordHash) {
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
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
module.exports = {
  createUser,
  getUserByEmail,
};
