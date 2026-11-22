import { registerService, loginService } from "../services/auth.js";
export async function register(req, res) {
  const { email, password } = req.body;
  const user = await registerService(email, password);
  res.status(201).json({
    status: "success",
    data: { user },
  });
}
export async function login(req, res) {
  const { email, password } = req.body;
  const { user, accessToken } = await loginService(email, password);
  res.status(200).json({
    status: "success",
    data: {
      user,
      accessToken,
    },
  });
}
