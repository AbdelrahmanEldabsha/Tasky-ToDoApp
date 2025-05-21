import Task from "../db/models/task.model.js"
import { appError } from "../utils/appError.js"
import cloudinary from "../utils/cloudinaryConfig.js"
import httpStatusText from "../utils/httpStatusText.js"
import { generateQrCode } from "../utils/qrCode.js"

export const addTask = async (req, res, next) => {
  const { id } = req.user
  const { title, description, endDate, priority } = req.body

  // Handle image upload if present
  let data = null
  if (req.file) {
    data = await cloudinary.uploader.upload(req.file.path, {
      folder: `users/tasks/${id}`,
    })
  }

  // Create new task instance
  const task = new Task({
    title,
    description,
    endDate,
    priority,
    user: id,
  })

  // Add image data if uploaded
  if (req.file) {
    task.image = {
      secure_url: data.secure_url,
      public_id: data.public_id,
    }
  }

  await task.save()
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { task } })
}

/**
 * Get all tasks for a user with optional progress filter
 */
export const getAllTasks = async (req, res, next) => {
  const { id } = req.user
  const { progress } = req.query

  // Build query based on progress filter
  const query = { user: id }
  if (progress) {
    query.progress = progress
  }

  const tasks = await Task.find(query)
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { tasks },
    count: tasks.length,
  })
}

/**
 * Get a specific task by ID and generate QR code
 */
export const getTaskById = async (req, res, next) => {
  const { id } = req.user
  const { taskId } = req.query

  // Validate taskId presence
  if (!taskId) {
    const error = appError.create(
      "TaskId is required",
      400,
      httpStatusText.FAIL
    )
    return next(error)
  }

  // Find and validate task
  const task = await Task.findById(taskId)
  if (!task) {
    const error = appError.create("Task not found", 404, httpStatusText.FAIL)
    return next(error)
  }

  // Check authorization
  if (task.user.toString() !== id) {
    const error = appError.create(
      "Not Authorized to access this task",
      401,
      httpStatusText.FAIL
    )
    return next(error)
  }

  // Generate QR code for task
  const qrcode = await generateQrCode(task)
  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { task, qrcode } })
}

/**
 * Update task details including image
 */
export const updateTask = async (req, res, next) => {
  const { id } = req.user
  const { taskId } = req.query
  const { title, description, endDate, priority, progress } = req.body

  if (!taskId) {
    const error = appError.create(
      "TaskId is required",
      400,
      httpStatusText.FAIL
    )
    return next(error)
  }

  // Find and validate task
  const task = await Task.findById(taskId)
  if (!task) {
    const error = appError.create("Task not found", 404, httpStatusText.FAIL)
    return next(error)
  }

  // Check authorization
  if (task.user.toString() !== id) {
    const error = appError.create(
      "Not Authorized to update this task",
      401,
      httpStatusText.FAIL
    )
    return next(error)
  }

  // Handle image update
  if (req.file) {
    const data = await cloudinary.uploader.upload(req.file.path, {
      folder: `users/tasks/${id}`,
    })
    if (task.image?.public_id) {
      await cloudinary.uploader.destroy(task.image.public_id)
    }
    task.image = {
      secure_url: data.secure_url,
      public_id: data.public_id,
    }
  }

  // Update task fields if provided
  Object.assign(task, {
    ...(title && { title }),
    ...(description && { description }),
    ...(endDate && { endDate }),
    ...(priority && { priority }),
    ...(progress && { progress }),
  })

  await task.save()
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { task } })
}

/**
 * Delete task and associated image
 */
export const deleteTask = async (req, res, next) => {
  const { id } = req.user
  const { taskId } = req.query

  if (!taskId) {
    const error = appError.create(
      "TaskId is required",
      400,
      httpStatusText.FAIL
    )
    return next(error)
  }

  const task = await Task.findById(taskId)
  if (!task) {
    const error = appError.create("Task not found", 404, httpStatusText.FAIL)
    return next(error)
  }

  if (task.user.toString() !== id) {
    const error = appError.create(
      "Not Authorized to delete this task",
      401,
      httpStatusText.FAIL
    )
    return next(error)
  }

  // Delete image from cloudinary if exists
  if (task.image?.public_id) {
    await cloudinary.uploader.destroy(task.image.public_id)
  }

  const deletedTask = await Task.findByIdAndDelete(taskId)
  res.status(200).json({ status: httpStatusText.SUCCESS, data: deletedTask })
}
