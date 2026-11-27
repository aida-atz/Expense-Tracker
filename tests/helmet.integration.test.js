import request from "supertest";
import app from "../app.js";

describe("Helmet Integration Tests", () => {
  test("adds security headers to API responses", async () => {
    const response = await request(app).get("/transactions");

    expect(response.status).toBe(401);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(response.headers["referrer-policy"]).toBe("no-referrer");
    expect(response.headers["content-security-policy"]).toBeDefined();
  });

  test("removes the X-Powered-By header", async () => {
    const response = await request(app).get("/transactions");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });

  test("adds security headers to 404 responses", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });
});
