import express from "express"
import multer from "multer"
import { multerLocal } from "../utils/localMulter.js"
import Authenticate from "../middlewares/Authentication.js"
import asyncWrapper from "../middlewares/asyncWrapper.js"
import * as taskController from "./task.controller.js"
import { multerCloud } from "../utils/cloudinaryMulter.js"
import * as taskValidation from "./task.model.js"
import { validateRequest } from "../middlewares/validateRequest.js"

const router = express.Router()

router.post(
  "/",
  Authenticate,
  multerCloud().single("image"),
  validateRequest(taskValidation.createTaskSchema),
  asyncWrapper(taskController.addTask)
)
router.get("/getTasks", Authenticate, asyncWrapper(taskController.getAllTasks))
router.get("/task", Authenticate, asyncWrapper(taskController.getTaskById))
router.put(
  "/updateTask",
  Authenticate,
  multerLocal().single("image"),
  validateRequest(taskValidation.updateTaskSchema),
  asyncWrapper(taskController.updateTask)
)
router.delete("/", Authenticate, asyncWrapper(taskController.deleteTask))
export default router
