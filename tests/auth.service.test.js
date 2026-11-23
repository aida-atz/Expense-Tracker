
import { jest } from "@jest/globals";

jest.unstable_mockModule(
  "../modules/auth/auth.repository.js",
  () => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  }),
);

jest.unstable_mockModule("argon2", () => ({
  default: {
    argon2id: 2,
    hash: jest.fn(),
    verify: jest.fn(),
  },
}));

jest.unstable_mockModule("../utils/jwt.js", () => ({
  createAccessToken: jest.fn(),
}));

const { createUser, getUserByEmail } = await import(
  "../modules/auth/auth.repository.js"
);

const { default: argon2 } = await import("argon2");

const { createAccessToken } = await import(
  "../utils/jwt.js"
);

const { registerService, loginService } = await import(
  "../modules/auth/auth.service.js"
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("registerService", () => {
  test("normalizes email, hashes password and creates user", async () => {
    const email = "  TEST@Example.com  ";
    const password = "StrongPassword123!";

    const user = {
      id: "user-123",
      email: "test@example.com",
    };

    argon2.hash.mockResolvedValue("hashed-password");
    createUser.mockResolvedValue(user);

    const result = await registerService(email, password);

    expect(argon2.hash).toHaveBeenCalledWith(password, {
      type: argon2.argon2id,
    });

    expect(createUser).toHaveBeenCalledWith(
      "test@example.com",
      "hashed-password",
    );

    expect(result).toEqual(user);
  });

  test("does not create user when hashing fails", async () => {
    const error = new Error("Hashing failed");

    argon2.hash.mockRejectedValue(error);

    await expect(
      registerService("test@example.com", "password123"),
    ).rejects.toBe(error);

    expect(createUser).not.toHaveBeenCalled();
  });

  test("propagates repository errors", async () => {
    const error = new Error("Database error");

    argon2.hash.mockResolvedValue("hashed-password");
    createUser.mockRejectedValue(error);

    await expect(
      registerService("test@example.com", "password123"),
    ).rejects.toBe(error);

    expect(createUser).toHaveBeenCalledTimes(1);
  });
});

describe("loginService", () => {
  const email = "test@example.com";
  const password = "StrongPassword123!";

  const user = {
    id: "user-123",
    email,
    passwordHash: "stored-password-hash",
  };

  test("returns a safe user object and access token", async () => {
    getUserByEmail.mockResolvedValue(user);
    argon2.verify.mockResolvedValue(true);
    createAccessToken.mockReturnValue("mock-access-token");

    const result = await loginService(
      "  TEST@Example.com  ",
      password,
    );

    expect(getUserByEmail).toHaveBeenCalledWith(email);

    expect(argon2.verify).toHaveBeenCalledWith(
      user.passwordHash,
      password,
    );

    expect(createAccessToken).toHaveBeenCalledWith(user.id);

    expect(result).toEqual({
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken: "mock-access-token",
    });

    expect(result.user).not.toHaveProperty("passwordHash");
  });

  test("throws 401 when user does not exist", async () => {
    getUserByEmail.mockResolvedValue(null);

    await expect(
      loginService(email, password),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });

    expect(argon2.verify).not.toHaveBeenCalled();
    expect(createAccessToken).not.toHaveBeenCalled();
  });

  test("throws 401 when password is incorrect", async () => {
    getUserByEmail.mockResolvedValue(user);
    argon2.verify.mockResolvedValue(false);

    await expect(
      loginService(email, "wrong-password"),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });

    expect(argon2.verify).toHaveBeenCalledWith(
      user.passwordHash,
      "wrong-password",
    );

    expect(createAccessToken).not.toHaveBeenCalled();
  });
});
