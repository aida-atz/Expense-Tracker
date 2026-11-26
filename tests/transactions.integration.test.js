import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
jest.unstable_mockModule(
  "../modules/transactions/transactions.repository.js",
  () => ({
    countTransactions: jest.fn(),
    getAllTransactions: jest.fn(),
    getTransactionById: jest.fn(),
    createTransaction: jest.fn(),
    updateTransactionById: jest.fn(),
    removeTransaction: jest.fn(),
    getTotalByType: jest.fn(),
  }),
);
const {
  countTransactions,
  getAllTransactions,
  createTransaction,
  updateTransactionById,
  removeTransaction,
  getTotalByType,
} = await import("../modules/transactions/transactions.repository.js");
const { createAccessToken } = await import("../utils/jwt.js");
jest.unstable_mockModule(
  "../modules/categories/categories.repository.js",
  () => ({
    getCategoryById: jest.fn(),
    getAllCategories: jest.fn(),
    createCategory: jest.fn(),
    updateCategoryById: jest.fn(),
    setCategoryArchived: jest.fn(),
  }),
);
const { getCategoryById } =
  await import("../modules/categories/categories.repository.js");
const { default: app } = await import("../app.js");
const userId = "11111111-1111-4111-8111-111111111111";
beforeEach(() => {
  jest.resetAllMocks();
});
describe("Transactions API Integration Tests", () => {
  test("GET /transactions returns paginated user transactions", async () => {
    const transactions = [
      {
        id: "33333333-3333-4333-8333-333333333333",
        amount: 150,
        userId,
      },
    ];

    getAllTransactions.mockResolvedValue(transactions);
    countTransactions.mockResolvedValue(15);

    const token = createAccessToken(userId);

    const response = await request(app)
      .get("/transactions?page=2&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(getAllTransactions).toHaveBeenCalledWith({
      userId,
      type: undefined,
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      skip: 10,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    expect(countTransactions).toHaveBeenCalledWith({
      userId,
      type: undefined,
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
    });

    expect(response.body.data).toEqual({
      transactions,
      pagination: {
        page: 2,
        limit: 10,
        total: 15,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });
  });
  test("POST /transactions creates a transaction", async () => {
    const categoryId = "22222222-2222-4222-8222-222222222222";
    const transactionId = "33333333-3333-4333-8333-333333333333";
    const payload = {
      amount: 150,
      categoryId,
      description: "Groceries",
    };

    getCategoryById.mockResolvedValue({
      id: categoryId,
      name: "Food",
      type: "EXPENSE",
      isDefault: false,
      isArchived: false,
      userId,
    });
    const transaction = {
      id: transactionId,
      amount: 150,
      categoryId,
      description: "Groceries",
      userId,
    };
    createTransaction.mockResolvedValue(transaction);
    const token = createAccessToken(userId);
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(getCategoryById).toHaveBeenCalledWith(categoryId, userId);
    expect(createTransaction).toHaveBeenCalledWith(
      payload.amount,
      payload.categoryId,
      payload.description,
      userId,
    );
    expect(response.body.data.transaction).toEqual(transaction);
  });

  test("POST /transactions rejects an invalid amount", async () => {
    const token = createAccessToken(userId);

    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: -100,
        categoryId: "22222222-2222-4222-8222-222222222222",
        description: "Invalid expense",
      });

    expect(response.status).toBe(400);

    expect(getCategoryById).not.toHaveBeenCalled();

    expect(createTransaction).not.toHaveBeenCalled();
  });

  test("GET /transactions/summary returns financial summary", async () => {
    const token = createAccessToken(userId);

    getTotalByType
      .mockResolvedValueOnce({
        _sum: { amount: "2500.00" },
      })
      .mockResolvedValueOnce({
        _sum: { amount: "750.25" },
      });

    const response = await request(app)
      .get("/transactions/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(getTotalByType).toHaveBeenNthCalledWith(1, userId, "INCOME");

    expect(getTotalByType).toHaveBeenNthCalledWith(2, userId, "EXPENSE");

    expect(response.body).toEqual({
      status: "success",
      data: {
        totalIncome: "2500.00",
        totalExpense: "750.25",
        balance: "1749.75",
      },
    });
  });
  test("GET /transactions/summary requires authentication", async () => {
    const response = await request(app).get("/transactions/summary");

    expect(response.status).toBe(401);

    expect(getTotalByType).not.toHaveBeenCalled();
  });

  test("GET /transactions/reports/monthly returns 12 monthly reports", async () => {
    const token = createAccessToken(userId);

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

    const response = await request(app)
      .get("/transactions/reports/monthly?year=2026")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");

    const { year, months } = response.body.data;

    expect(year).toBe(2026);
    expect(months).toHaveLength(12);

    expect(months.map((item) => item.month)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );

    expect(months[10]).toEqual({
      month: 11,
      income: "3000.00",
      expense: "1200.50",
      balance: "1799.50",
    });

    expect(months[0]).toEqual({
      month: 1,
      income: "0.00",
      expense: "0.00",
      balance: "0.00",
    });

    expect(getTotalByType).toHaveBeenCalledTimes(24);
  });
  test("GET /transactions/reports/monthly rejects invalid year", async () => {
    const token = createAccessToken(userId);

    const response = await request(app)
      .get("/transactions/reports/monthly?year=1999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);

    expect(getTotalByType).not.toHaveBeenCalled();
  });
  test("GET /transactions/reports/monthly requires authentication", async () => {
    const response = await request(app).get(
      "/transactions/reports/monthly?year=2026",
    );

    expect(response.status).toBe(401);

    expect(getTotalByType).not.toHaveBeenCalled();
  });
});

const transactionId = "33333333-3333-4333-8333-333333333333";
const categoryId = "22222222-2222-4222-8222-222222222222";

describe("PATCH /transactions/:id", () => {
  test("updates the amount of a transaction", async () => {
    const updatedTransaction = {
      id: transactionId,
      amount: 250,
      categoryId,
      userId,
    };

    updateTransactionById.mockResolvedValue(updatedTransaction);

    const token = createAccessToken(userId);

    const response = await request(app)
      .patch(`/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 250 });

    expect(response.status).toBe(200);

    expect(updateTransactionById).toHaveBeenCalledWith(
      transactionId,
      { amount: 250 },
      userId,
    );

    expect(getCategoryById).not.toHaveBeenCalled();

    expect(response.body.data.transaction).toEqual(updatedTransaction);
  });

  test("validates the new category before updating", async () => {
    const newCategoryId = "44444444-4444-4444-8444-444444444444";

    getCategoryById.mockResolvedValue({
      id: newCategoryId,
      isArchived: false,
      isDefault: false,
      userId,
    });

    updateTransactionById.mockResolvedValue({
      id: transactionId,
      categoryId: newCategoryId,
      userId,
    });

    const token = createAccessToken(userId);

    const response = await request(app)
      .patch(`/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryId: newCategoryId });

    expect(response.status).toBe(200);

    expect(getCategoryById).toHaveBeenCalledWith(newCategoryId, userId);

    expect(updateTransactionById).toHaveBeenCalledWith(
      transactionId,
      { categoryId: newCategoryId },
      userId,
    );
  });

  test("does not update when category is inaccessible", async () => {
    const inaccessibleCategoryId = "55555555-5555-4555-8555-555555555555";

    getCategoryById.mockResolvedValue(null);

    const token = createAccessToken(userId);

    const response = await request(app)
      .patch(`/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryId: inaccessibleCategoryId });

    expect(response.status).toBe(404);

    expect(getCategoryById).toHaveBeenCalledWith(
      inaccessibleCategoryId,
      userId,
    );

    expect(updateTransactionById).not.toHaveBeenCalled();
  });

  test("returns 404 when transaction is not owned by user", async () => {
    const error = Object.assign(new Error("Record to update not found"), {
      code: "P2025",
    });

    updateTransactionById.mockRejectedValue(error);

    const token = createAccessToken(userId);

    const response = await request(app)
      .patch(`/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 300 });

    expect(response.status).toBe(404);

    expect(updateTransactionById).toHaveBeenCalledWith(
      transactionId,
      { amount: 300 },
      userId,
    );
  });
});

describe("DELETE /transactions/:id", () => {
  test("successfully deletes a transaction", async () => {
    const deletedTransaction = {
      id: transactionId,
      amount: 150,
      categoryId,
      userId,
    };

    removeTransaction.mockResolvedValue(deletedTransaction);

    const token = createAccessToken(userId);

    const response = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(removeTransaction).toHaveBeenCalledWith(transactionId, userId);

    expect(response.body.data.transaction).toEqual(deletedTransaction);
  });

  test("returns 404 when deleting another user's transaction", async () => {
    const error = Object.assign(new Error("Record to delete not found"), {
      code: "P2025",
    });

    removeTransaction.mockRejectedValue(error);

    const token = createAccessToken(userId);

    const response = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);

    expect(removeTransaction).toHaveBeenCalledWith(transactionId, userId);
  });
});
