import express from "express"
import asyncWrapper from "../middlewares/asyncWrapper.js"
import * as userController from "./user.controller.js"
import { validateRequest } from "../middlewares/validateRequest.js"
import { loginSchema, signUpSchema } from "./user.mode.js"
import Authenticate from "../middlewares/Authentication.js"
const router = express.Router()

router.post(
  "/register",
  validateRequest(signUpSchema),
  asyncWrapper(userController.signUp)
)
router.post(
  "/login",
  validateRequest(loginSchema),
  asyncWrapper(userController.login)
)
router.get("/", asyncWrapper(userController.getAllUsers))
router.get("/getUser", Authenticate, asyncWrapper(userController.getUser))
router.post("/send-otp", Authenticate, asyncWrapper(userController.sendOTP))
router.post("/verify-otp", Authenticate, asyncWrapper(userController.verifyOtp))
export default router
