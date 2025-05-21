import Joi from "joi"
import joiPhoneNumber from "joi-phone-number"
import { errMessages } from "../utils/joiErrMessages.js"

const CustomJoi = Joi.extend(joiPhoneNumber)

export const signUpSchema = CustomJoi.object().keys({
  phone: CustomJoi.string()
    .pattern(/^\+\d+$/)
    .phoneNumber({ format: "e164", strict: true })
    .messages(errMessages.phone),

  name: CustomJoi.string().required().min(2).messages(errMessages.name),

  password: CustomJoi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d).*$/) // Requires at least one uppercase letter and one number
    .messages(errMessages.password),

  yearsOfExperience: CustomJoi.number().optional().min(0).messages({
    "number.min": "Years of experience cannot be negative",
  }),
  experienceLevel: CustomJoi.string()
    .optional()
    .valid("Junior", "Mid", "Senior", "Team Lead")
    .messages({
      "any.only": "Experience level must be Junior, Mid, Senior, or Team Lead",
    }),

  address: CustomJoi.string().optional(),
})
export const loginSchema = CustomJoi.object().keys({
  phone: CustomJoi.string()
    .pattern(/^\+\d+$/)
    .phoneNumber({ format: "e164", strict: true })
    .messages(errMessages.phone),
  password: CustomJoi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d).*$/) // Requires at least one uppercase letter and one number
    .messages(errMessages.password),
})
