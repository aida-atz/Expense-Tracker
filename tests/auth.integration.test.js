import { jest } from "@jest/globals";
import request from "supertest";
import AppError from "../utils/AppError.js";

jest.unstable_mockModule("../modules/auth/auth.service.js", () => ({
  registerService: jest.fn(),
  loginService: jest.fn(),
}));

const { registerService, loginService } =
  await import("../modules/auth/auth.service.js");

const { default: app } = await import("../app.js");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Auth API Integration Tests", () => {
  describe("POST /auth/register", () => {
    test("registers a user with valid data", async () => {
      const payload = {
        email: "test@example.com",
        password: "StrongPassword123!",
      };

      const user = {
        id: "user-123",
        email: payload.email,
      };

      registerService.mockResolvedValue(user);

      const response = await request(app).post("/auth/register").send(payload);

      expect(response.status).toBe(201);

      expect(registerService).toHaveBeenCalledWith(
        payload.email,
        payload.password,
      );

      expect(registerService).toHaveBeenCalledTimes(1);

      expect(JSON.stringify(response.body)).not.toContain("passwordHash");
    });

    test("rejects an invalid email", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "invalid-email",
        password: "StrongPassword123!",
      });

      expect(response.status).toBe(400);

      expect(registerService).not.toHaveBeenCalled();
    });

    test("returns 409 when email already exists", async () => {
      const prismaError = Object.assign(new Error("Unique constraint failed"), {
        code: "P2002",
        meta: {
          target: ["email"],
        },
      });

      registerService.mockRejectedValue(prismaError);

      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "StrongPassword123!",
      });

      expect(response.status).toBe(409);
      expect(registerService).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /auth/login", () => {
    test("logs in a user with valid credentials", async () => {
      const payload = {
        email: "test@example.com",
        password: "StrongPassword123!",
      };

      loginService.mockResolvedValue({
        user: {
          id: "user-123",
          email: payload.email,
        },
        accessToken: "mock-access-token",
      });

      const response = await request(app).post("/auth/login").send(payload);

      expect(response.status).toBe(200);

      expect(loginService).toHaveBeenCalledWith(
        payload.email,
        payload.password,
      );

      expect(JSON.stringify(response.body)).toContain("mock-access-token");
    });

    test("returns 401 for invalid credentials", async () => {
      loginService.mockRejectedValue(
        new AppError("Invalid email or password", 401),
      );

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);

      expect(loginService).toHaveBeenCalledTimes(1);
    });

    test("rejects an invalid login request", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "invalid-email",
        password: "StrongPassword123!",
      });

      expect(response.status).toBe(400);

      expect(loginService).not.toHaveBeenCalled();
    });
  });
});
