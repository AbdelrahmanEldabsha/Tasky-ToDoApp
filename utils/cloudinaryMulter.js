import multer from "multer"
export const multerCloud = () => {
  const diskStorage = multer.diskStorage({})

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
