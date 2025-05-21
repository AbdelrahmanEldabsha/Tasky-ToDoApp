import User from "../db/models/user.model.js"
import generateJWT from "../utils/generateJWT.js"
import { pagination } from "../utils/pagination.js"
import bcrypt from "bcrypt"
import { appError } from "../utils/appError.js"
import httpStatusText from "../utils/httpStatusText.js"
import { generateOTP } from "../utils/generateOTP.js"
import { sendSMS } from "../utils/sendSMS.js"

export const signUp = async (req, res, next) => {
  const { name, phone, yearsOfExperience, experienceLevel, adress, password } =
    req.body

  const userExist = await User.findOne({ phone })
  if (userExist) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.FAIL
    )
    return next(error)
  }

  // Hash password and create new user
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({
    name,
    phone,
    yearsOfExperience,
    experienceLevel,
    adress,
    password: hashedPassword,
  })
  await newUser.save()

  // Generate JWT token
  const token = generateJWT({
    phone: newUser.phone,
    id: newUser._id,
  })

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user: newUser, token },
  })
}

/**
 * Get all users with pagination
 */
export const getAllUsers = async (req, res, next) => {
  const { limit, skip } = pagination(req)

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip)

  res.json({ status: httpStatusText.SUCCESS, data: { users } })
}

/**
 * Get user profile
 */
export const getUser = async (req, res, next) => {
  const { id } = req.user
  if (!id) {
    const error = appError.create("Login first", 401, httpStatusText.FAIL)
    return next(error)
  }

  const user = await User.findById(id)
  if (!user) {
    const error = appError.create("User not found", 404, httpStatusText.FAIL)
    return next(error)
  }

  res.json({ status: httpStatusText.SUCCESS, data: { user } })
}

/**
 * Authenticate user and generate token
 */
export const login = async (req, res, next) => {
  const { phone, password } = req.body

  if (!phone || !password) {
    const error = appError.create(
      "Phone and password are required",
      400,
      httpStatusText.FAIL
    )
    return next(error)
  }

  const user = await User.findOne({ phone })
  if (!user) {
    const error = appError.create(
      "User not found, Please Sign Up first",
      404,
      httpStatusText.FAIL
    )
    return next(error)
  }

  const matchedPassword = await bcrypt.compare(password, user.password)
  if (!matchedPassword) {
    const error = appError.create("Wrong credentials", 401, httpStatusText.FAIL)
    return next(error)
  }

  if (!user.isPhoneVerified) {
    const error = appError.create(
      "Please verify your phone number first",
      401,
      httpStatusText.FAIL
    )
    return next(error)
  }

  const token = generateJWT({ phone: user.phone, id: user._id })
  return res.json({ status: httpStatusText.SUCCESS, data: { token } })
}

/**
 * Send OTP to user's phone
 */
export const sendOTP = async (req, res, next) => {
  const { id } = req.user
  const { phoneNumber } = req.body

  const otp = generateOTP(6)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry

  await User.findByIdAndUpdate(id, {
    otp: { code: otp, expiresAt },
  })

  const isSent = await sendSMS(phoneNumber, otp)
  if (!isSent) {
    const error = appError.create(
      "Failed to send OTP",
      500,
      httpStatusText.ERROR
    )
    return next(error)
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "OTP sent successfully",
  })
}

/**
 * Verify OTP and update phone verification status
 */
export const verifyOtp = async (req, res, next) => {
  const { id } = req.user
  const { otp } = req.body

  const user = await User.findById(id)
  if (!user?.otp) {
    const error = appError.create("No OTP found", 400, httpStatusText.FAIL)
    return next(error)
  }

  if (Date.now() > user.otp.expiresAt) {
    const error = appError.create("OTP has expired", 400, httpStatusText.FAIL)
    return next(error)
  }

  if (otp !== user.otp.code) {
    const error = appError.create("Invalid OTP", 400, httpStatusText.FAIL)
    return next(error)
  }

  await User.findByIdAndUpdate(id, {
    isPhoneVerified: true,
    $unset: { otp: 1 },
  })

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Phone number verified successfully",
  })
}
