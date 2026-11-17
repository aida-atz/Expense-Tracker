const { registerService } = require("../services/auth.cjs");
async function register(req, res) {
  const { email, password } = req.body;
  const user = await registerService(email, password);
  res.status(201).json({
    status: "success",
    data: { user },
  });
}
module.exports = {
  register,
};
