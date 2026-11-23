import express from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "./auth.validator.js";
import validateRequest from "../../middlewares/validateRequest.js";
const router = express.Router();
router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
export default router;
