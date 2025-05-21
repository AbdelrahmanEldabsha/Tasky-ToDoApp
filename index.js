import express from "express"
import { config } from "dotenv"
import { connectDB } from "./db/connection.js"
import httpStatusText from "./utils/httpStatusText.js"
import userRouter from "./users/user.route.js"
import taskRouter from "./tasks/task.route.js"
import path from "path"
import { fileURLToPath } from "url"

// Configure environment variables
config()

// Setup directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize express application
const app = express()

// Global Middleware
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Connect to MongoDB
connectDB()

// Routes
app.get("/", (req, res) => res.send("Hello World!"))
app.use("/api/users", userRouter)
app.use("/api/tasks", taskRouter)

// 404 Handler - Route not found
app.all(/.*/, (req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This resource is not available",
  })
})

// Global Error Handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  })
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
