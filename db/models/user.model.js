import { Schema, model } from "mongoose"
import validator from "validator"
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
    },
    experienceLevel: {
      type: String,
      enum: ["Junior", "Mid", "Senior", "Team Lead"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    isPhoneVerified: {
      type: Boolean,

      /*
       *the default should be false but we changed it until configuring twilio
       */
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const User = model("User", userSchema)

export default User
