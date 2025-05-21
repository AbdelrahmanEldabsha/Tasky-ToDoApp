import QRcode from "qrcode"
export const generateQrCode = async (data = "") => {
  const { title, description, priority, endDate, progress, image } = data

  const qrcode = QRcode.toDataURL(
    JSON.stringify({
      title,
      description,
      priority,
      endDate,
      progress,
      image: image.secure_url,
    }),
    {
      errorCorrectionLevel: "H",
    }
  )
  return qrcode
}
