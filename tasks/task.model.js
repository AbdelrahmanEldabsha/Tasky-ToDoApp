import Joi from "joi"

// Create task validation schema
export const createTaskSchema = Joi.object({
  title: Joi.string().required().min(3).trim().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
  }),
  description: Joi.string().required().trim().messages({
    "string.empty": "Description is required",
  }),
  priority: Joi.string()
    .valid("low", "medium", "high")
    .default("medium")
    .messages({
      "any.only": "Priority must be low, medium, or high",
    }),
  endDate: Joi.date().required().greater("now").messages({
    "date.greater": "End date must be in the future",
    "any.required": "End date is required",
  }),
})

// Update task validation schema
export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).trim(),
  description: Joi.string().trim(),
  priority: Joi.string().valid("low", "medium", "high"),
  progress: Joi.string().valid("Waiting", "inprogress", "Finished"),
  endDate: Joi.date().greater("now"),
})
