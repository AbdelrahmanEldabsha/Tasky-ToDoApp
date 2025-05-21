import twilio from "twilio"
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export const sendSMS = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
    console.log(`OTP sent to ${phoneNumber} with message SID: ${message.sid}`)
    return true
  } catch (error) {
    console.error("Error sending OTP:", error)
    return false
  }
}
