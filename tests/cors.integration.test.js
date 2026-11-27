import "dotenv/config";
import request from "supertest";

const ALLOWED_ORIGIN = "http://localhost:5173";
const BLOCKED_ORIGIN = "http://localhost:9999";

process.env.CORS_ORIGINS = ALLOWED_ORIGIN;

const { default: app } = await import("../app.js");
describe("CORS Integration Tests", () => {
  test("allows preflight requests from an allowed origin", async () => {
    const response = await request(app)
      .options("/transactions")
      .set("Origin", ALLOWED_ORIGIN)
      .set("Access-Control-Request-Method", "GET")
      .set("Access-Control-Request-Headers", "authorization");

    expect(response.status).toBe(204);

    expect(response.headers["access-control-allow-origin"]).toBe(
      ALLOWED_ORIGIN,
    );

    expect(response.headers["access-control-allow-methods"]).toContain("GET");

    expect(response.headers["access-control-allow-headers"]).toContain(
      "Authorization",
    );
  });
  test("does not allow CORS access from a blocked origin", async () => {
    const response = await request(app)
      .options("/transactions")
      .set("Origin", BLOCKED_ORIGIN)
      .set("Access-Control-Request-Method", "GET")
      .set("Access-Control-Request-Headers", "authorization");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
  test("processes requests without an Origin header", async () => {
    const response = await request(app).get("/transactions");

    expect(response.status).toBe(401);
  });
});
