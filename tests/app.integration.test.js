
import request from "supertest";
import app from "../app.js";

describe("Express App Integration Tests", () => {
  describe("Unknown Routes", () => {
    test("GET /unknown returns 404", async () => {
      const response = await request(app).get("/unknown");

      expect(response.status).toBe(404);
    });
  });

  describe("Authentication Middleware", () => {
    test("GET /transactions without JWT returns 401", async () => {
      const response = await request(app).get("/transactions");

      expect(response.status).toBe(401);
    });

    test("GET /categories without JWT returns 401", async () => {
      const response = await request(app).get("/categories");

      expect(response.status).toBe(401);
    });

    test("GET /transactions with an invalid JWT returns 401", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
    });
  });
});
