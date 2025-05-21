import jwt from "jsonwebtoken"
import httpStatusText from "../utils/httpStatusText.js"
import { appError } from "../utils/appError.js"

/**
 * Authentication middleware to verify JWT tokens
 */
const Authenticate = (req, res, next) => {
  // Get authorization header from request (supports both cases)
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"]

  // Check if authorization header exists
  if (!authHeader) {
    const error = appError.create(
      "token is required",
      401,
      httpStatusText.ERROR
    )
    return next(error)
  }

  // Extract token from Bearer format
  const token = authHeader.split(" ")[1]

  try {
    // Verify token using JWT_SECRET_KEY from environment variables
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // Add decoded user data to request object for use in subsequent middleware
    req.user = currentUser
    next()
  } catch (err) {
    // Handle invalid or expired tokens
    const error = appError.create("invalid token", 401, httpStatusText.ERROR)
    return next(error)
  }
}

export default Authenticate
