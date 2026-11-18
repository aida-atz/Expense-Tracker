const { registerService, loginService } = require("../services/auth.cjs");
async function register(req, res) {
  const { email, password } = req.body;
  const user = await registerService(email, password);
  res.status(201).json({
    status: "success",
    data: { user },
  });
}
async function login(req, res) {
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
module.exports = {
  register,
  login,
};
