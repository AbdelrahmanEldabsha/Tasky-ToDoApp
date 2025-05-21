import mongoose from "mongoose"

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority level",
      },
      default: "medium",
    },
    progress: {
      type: String,
      enum: {
        values: ["Waiting", "inprogress", "Finished"],
        message: "{VALUE} is not a valid priority level",
      },
      default: "Waiting",
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value > new Date()
        },
        message: "End date must be in the future",
      },
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.model("Task", taskSchema)

export default Task
