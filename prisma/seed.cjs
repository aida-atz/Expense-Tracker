const prisma = require("../config/prisma.cjs");

const defaultCategories = [
  { name: "Salary", type: "INCOME" },
  { name: "Freelance", type: "INCOME" },
  { name: "Food", type: "EXPENSE" },
  { name: "Rent", type: "EXPENSE" },
  { name: "Transportation", type: "EXPENSE" },
  { name: "Shopping", type: "EXPENSE" },
];

async function main() {
  for (const category of defaultCategories) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: category.name,
        type: category.type,
        isDefault: true,
        userId: null,
      },
    });

    if (existingCategory) {
      console.log(`Skipped: ${category.name}`);
      continue;
    }

    await prisma.category.create({
      data: {
        name: category.name,
        type: category.type,
        isDefault: true,
        isArchived: false,
        userId: null,
      },
    });

    console.log(`Created: ${category.name}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
