const { registerValidator, loginValidator } = require("../validators/auth.cjs");
const validateRequest = require("../middlewares/validateRequest.cjs");
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.cjs");
router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
module.exports = router;
