import { jest } from "@jest/globals";

jest.unstable_mockModule(
  "../modules/transactions/transactions.repository.js",
  () => ({
    getAllTransactions: jest.fn(),
    getTransactionById: jest.fn(),
    createTransaction: jest.fn(),
    updateTransactionById: jest.fn(),
    removeTransaction: jest.fn(),
  }),
);
jest.unstable_mockModule("../modules/categories/index.js", () => ({
  validateActiveCategory: jest.fn(),
}));
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  removeTransaction,
} = await import("../modules/transactions/transactions.repository.js");
const { validateActiveCategory } =
  await import("../modules/categories/index.js");
const {
  getTransactionsService,
  getTransactionService,
  addTransactionService,
  deleteTransactionService,
  updateTransactionService,
} = await import("../modules/transactions/transactions.service.js");
beforeEach(() => {
  jest.resetAllMocks();
});
describe("getTransactionsService", () => {
  test("returns transactions belonging to the user", async () => {
    const userId = "user-123";
    const transactions = [
      { id: "transaction-1", amount: 100, userId },
      { id: "transaction-2", amount: 200, userId },
    ];
    getAllTransactions.mockResolvedValue(transactions);
    const result = await getTransactionsService(undefined, userId);
    expect(getAllTransactions).toHaveBeenCalledWith(undefined, userId);
    expect(result).toEqual(transactions);
  });

  test("passes the transaction type to repository", async () => {
    const userId = "user-123";
    getAllTransactions.mockResolvedValue([]);
    await getTransactionsService("EXPENSE", userId);
    expect(getAllTransactions).toHaveBeenCalledWith("EXPENSE", userId);
  });
});

describe("getTransactionService", () => {
  const userId = "user-123";
  const transactionId = "transaction-123";

  test("returns an existing transaction", async () => {
    const transaction = {
      id: transactionId,
      amount: 150,
      userId,
    };

    getTransactionById.mockResolvedValue(transaction);

    const result = await getTransactionService(transactionId, userId);

    expect(result).toEqual(transaction);

    expect(getTransactionById).toHaveBeenCalledWith(transactionId, userId);
  });

  test("throws 404 when transaction does not exist", async () => {
    getTransactionById.mockResolvedValue(null);

    await expect(
      getTransactionService(transactionId, userId),
    ).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(getTransactionById).toHaveBeenCalledWith(transactionId, userId);
  });
});

describe("addTransactionService", () => {
  const userId = "user-123";
  const categoryId = "category-123";

  test("creates a transaction with a valid category", async () => {
    const amount = 250;
    const description = "Groceries";

    const transaction = {
      id: "transaction-123",
      amount,
      categoryId,
      description,
      userId,
    };

    validateActiveCategory.mockResolvedValue(undefined);
    createTransaction.mockResolvedValue(transaction);

    const result = await addTransactionService(
      amount,
      categoryId,
      description,
      userId,
    );

    expect(validateActiveCategory).toHaveBeenCalledWith(categoryId, userId);

    expect(createTransaction).toHaveBeenCalledWith(
      amount,
      categoryId,
      description,
      userId,
    );

    expect(result).toEqual(transaction);
  });

  test("does not create a transaction with an invalid category", async () => {
    validateActiveCategory.mockRejectedValue({
      statusCode: 404,
      message: "Category not found",
    });

    await expect(
      addTransactionService(250, categoryId, "Groceries", userId),
    ).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(validateActiveCategory).toHaveBeenCalledWith(categoryId, userId);

    expect(createTransaction).not.toHaveBeenCalled();
  });
});

describe("updateTransactionService", () => {
  const userId = "user-123";
  const transactionId = "transaction-123";

  test("updates amount without revalidating category", async () => {
    const updatedTransaction = {
      id: transactionId,
      amount: 300,
      userId,
    };

    updateTransactionById.mockResolvedValue(updatedTransaction);

    const result = await updateTransactionService(
      undefined,
      transactionId,
      300,
      undefined,
      userId,
    );

    expect(validateActiveCategory).not.toHaveBeenCalled();

    expect(updateTransactionById).toHaveBeenCalledWith(
      transactionId,
      { amount: 300 },
      userId,
    );

    expect(result).toEqual(updatedTransaction);
  });

  test("validates category when categoryId changes", async () => {
    const newCategoryId = "category-456";

    validateActiveCategory.mockResolvedValue(undefined);

    updateTransactionById.mockResolvedValue({
      id: transactionId,
      categoryId: newCategoryId,
      userId,
    });
    await updateTransactionService(
      newCategoryId,
      transactionId,
      undefined,
      undefined,
      userId,
    );
    expect(validateActiveCategory).toHaveBeenCalledWith(newCategoryId, userId);
    expect(updateTransactionById).toHaveBeenCalledWith(
      transactionId,
      { categoryId: newCategoryId },
      userId,
    );
  });
  test("allows clearing description with null", async () => {
    updateTransactionById.mockResolvedValue({
      id: transactionId,
      description: null,
      userId,
    });
    await updateTransactionService(
      undefined,
      transactionId,
      undefined,
      null,
      userId,
    );
    expect(validateActiveCategory).not.toHaveBeenCalled();
    expect(updateTransactionById).toHaveBeenCalledWith(
      transactionId,
      { description: null },
      userId,
    );
  });
});

describe("deleteTransactionService", () => {
  test("deletes a transaction scoped to the user", async () => {
    const userId = "user-123";
    const transactionId = "transaction-123";
    const deletedTransaction = {
      id: transactionId,
      amount: 150,
      userId,
    };
    removeTransaction.mockResolvedValue(deletedTransaction);
    const result = await deleteTransactionService(transactionId, userId);
    expect(removeTransaction).toHaveBeenCalledWith(transactionId, userId);
    expect(result).toEqual(deletedTransaction);
  });
});
