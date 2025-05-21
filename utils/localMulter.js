import multer from "multer"
export const multerLocal = () => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1]
      const fileName = `task-${Date.now()}.${ext}`
      cb(null, fileName)
    },
  })

  const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0]

    if (imageType === "image") {
      return cb(null, true)
    } else {
      return cb(appError.create("file must be an image", 400), false)
    }
  }
  const fileUpload = multer({
    fileFilter,
    storage: diskStorage,
  })
  return fileUpload
}
