export const pagination = (req) => {
  const query = req.query

  const limit = query.limit || 10
  const page = query.page || 1
  const skip = (page - 1) * limit
  return { limit, skip }
}
