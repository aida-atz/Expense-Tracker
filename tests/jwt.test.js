
import jwt from "jsonwebtoken";
import { createAccessToken } from "../utils/jwt.js";

describe("createAccessToken", () => {
  const userId = "11111111-1111-4111-8111-111111111111";

  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-key-for-jwt-unit-tests-123456789";
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  test("creates a valid JWT with correct payload and expiration", () => {
    const token = createAccessToken(userId);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      },
    );

    expect(decoded.sub).toBe(userId);

    expect(decoded.iat).toEqual(expect.any(Number));
    expect(decoded.exp).toEqual(expect.any(Number));

    expect(decoded.exp - decoded.iat).toBe(3600);
  });

  test("signs the JWT using HS256 algorithm", () => {
    const token = createAccessToken(userId);

    const decoded = jwt.decode(token, {
      complete: true,
    });

    expect(decoded.header.alg).toBe("HS256");
    expect(decoded.header.typ).toBe("JWT");
  });

  test("rejects verification with an incorrect secret", () => {
    const token = createAccessToken(userId);

    expect(() =>
      jwt.verify(token, "incorrect-secret", {
        algorithms: ["HS256"],
      }),
    ).toThrow();
  });
});
