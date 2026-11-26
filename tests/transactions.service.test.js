import { jest } from "@jest/globals";

jest.unstable_mockModule(
  "../modules/transactions/transactions.repository.js",
  () => ({
    getAllTransactions: jest.fn(),
    getTransactionById: jest.fn(),
    createTransaction: jest.fn(),
    updateTransactionById: jest.fn(),
    removeTransaction: jest.fn(),
    countTransactions: jest.fn(),
    getTotalByType: jest.fn(),
  }),
);
jest.unstable_mockModule("../modules/categories/index.js", () => ({
  validateActiveCategory: jest.fn(),
}));
const {
  countTransactions,
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  removeTransaction,
  getTotalByType,
} = await import("../modules/transactions/transactions.repository.js");
const { validateActiveCategory } =
  await import("../modules/categories/index.js");
const {
  getTransactionsService,
  getTransactionService,
  addTransactionService,
  deleteTransactionService,
  updateTransactionService,
  getSummaryService,
  getMonthlyReportService,
  getYearlyReportService,
} = await import("../modules/transactions/transactions.service.js");
beforeEach(() => {
  jest.resetAllMocks();
});

describe("getTransactionsService", () => {
  const userId = "user-123";

  test("returns paginated transactions belonging to the user", async () => {
    const filters = {
      page: 1,
      limit: 10,
    };

    const transactions = [
      { id: "transaction-1", amount: 100, userId },
      { id: "transaction-2", amount: 200, userId },
    ];

    getAllTransactions.mockResolvedValue(transactions);
    countTransactions.mockResolvedValue(12);

    const result = await getTransactionsService(filters, userId);

    expect(getAllTransactions).toHaveBeenCalledWith({
      userId,
      type: undefined,
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      skip: 0,
      limit: 10,
      sortBy: undefined,
      sortOrder: undefined,
    });

    expect(countTransactions).toHaveBeenCalledWith({
      userId,
      type: undefined,
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
    });

    expect(result).toEqual({
      transactions,
      pagination: {
        page: 1,
        limit: 10,
        total: 12,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  test("passes type filter and calculates pagination correctly", async () => {
    const filters = {
      type: "EXPENSE",
      page: 2,
      limit: 10,
    };

    getAllTransactions.mockResolvedValue([]);
    countTransactions.mockResolvedValue(25);

    const result = await getTransactionsService(filters, userId);

    expect(getAllTransactions).toHaveBeenCalledWith({
      userId,
      type: "EXPENSE",
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      skip: 10,
      limit: 10,
      sortBy: undefined,
      sortOrder: undefined,
    });

    expect(countTransactions).toHaveBeenCalledWith({
      userId,
      type: "EXPENSE",
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
    });

    expect(result).toEqual({
      transactions: [],
      pagination: {
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
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

describe("getSummaryService", () => {
  const userId = "user-123";

  test("calculates total income, expense, and balance", async () => {
    getTotalByType
      .mockResolvedValueOnce({
        _sum: { amount: "5000.00" },
      })
      .mockResolvedValueOnce({
        _sum: { amount: "1800.50" },
      });

    const result = await getSummaryService(userId);

    expect(getTotalByType).toHaveBeenNthCalledWith(1, userId, "INCOME");

    expect(getTotalByType).toHaveBeenNthCalledWith(2, userId, "EXPENSE");

    expect(result).toEqual({
      totalIncome: "5000.00",
      totalExpense: "1800.50",
      balance: "3199.50",
    });
  });

  test("returns zero when no transactions exist", async () => {
    getTotalByType.mockResolvedValue({
      _sum: { amount: null },
    });

    const result = await getSummaryService(userId);

    expect(result).toEqual({
      totalIncome: "0.00",
      totalExpense: "0.00",
      balance: "0.00",
    });
  });

  test("calculates a negative balance correctly", async () => {
    getTotalByType
      .mockResolvedValueOnce({
        _sum: { amount: "0.00" },
      })
      .mockResolvedValueOnce({
        _sum: { amount: "91.05" },
      });

    const result = await getSummaryService(userId);

    expect(result).toEqual({
      totalIncome: "0.00",
      totalExpense: "91.05",
      balance: "-91.05",
    });
  });
});

describe("getYearlyReportService", () => {
  const userId = "user-123";

  test("returns financial reports for all 12 months", async () => {
    getTotalByType.mockImplementation(async (userId, type, dateRange) => {
      const month = dateRange.startDate.getUTCMonth() + 1;

      if (month === 11) {
        return {
          _sum: {
            amount: type === "INCOME" ? "3000.00" : "1200.50",
          },
        };
      }

      return {
        _sum: { amount: null },
      };
    });

    const result = await getYearlyReportService(userId, 2026);

    expect(result.year).toBe(2026);

    expect(result.months).toHaveLength(12);

    expect(result.months.map((item) => item.month)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);

    expect(result.months[10]).toEqual({
      month: 11,
      income: "3000.00",
      expense: "1200.50",
      balance: "1799.50",
    });

    expect(result.months[0]).toEqual({
      month: 1,
      income: "0.00",
      expense: "0.00",
      balance: "0.00",
    });

    expect(getTotalByType).toHaveBeenCalledTimes(24);
  });
});
