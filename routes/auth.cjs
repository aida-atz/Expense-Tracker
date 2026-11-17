const { registerValidator } = require("../validators/auth.cjs");
const validateRequest = require("../middlewares/validateRequest.cjs");
const express = require("express");
const router = express.Router();
const { register } = require("../controllers/auth.cjs");
router.post("/register", registerValidator, validateRequest, register);
module.exports = router;
