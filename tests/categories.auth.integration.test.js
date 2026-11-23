import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";

const originalSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = "integration-test-only-secret";

// Mock Categories Repository
jest.unstable_mockModule(
  "../modules/categories/categories.repository.js",
  () => ({
    getAllCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategoryById: jest.fn(),
    setCategoryArchived: jest.fn(),
  }),
);

const { getAllCategories } =
  await import("../modules/categories/categories.repository.js");

const { createAccessToken } = await import("../utils/jwt.js");
const { default: app } = await import("../app.js");

beforeEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

describe("Categories JWT Integration Tests", () => {
  const userId = "11111111-1111-4111-8111-111111111111";

  test("accepts a valid JWT", async () => {
    const categories = [
      {
        id: "category-123",
        name: "Food",
        userId,
        isDefault: false,
      },
    ];

    getAllCategories.mockResolvedValue(categories);

    const token = createAccessToken(userId);
 
    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(getAllCategories).toHaveBeenCalledWith(userId);

    expect(response.body.data.categories).toEqual(categories);
  });

  test("rejects a JWT with an invalid signature", async () => {
    const forgedToken = jwt.sign({ sub: userId }, "wrong-secret", {
      algorithm: "HS256",
    });

    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${forgedToken}`);

    expect(response.status).toBe(401);
    expect(getAllCategories).not.toHaveBeenCalled();
  });

  test("rejects an expired JWT", async () => {
    const expiredToken = jwt.sign(
      {
        sub: userId,
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      process.env.JWT_SECRET,
      { algorithm: "HS256" },
    );

    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(getAllCategories).not.toHaveBeenCalled();
  });
});
