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
module.exports = {
  createUser,
};
