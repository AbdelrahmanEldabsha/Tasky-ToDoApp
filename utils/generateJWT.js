import jwt from "jsonwebtoken"

export default (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  })

  return token
}
