import multer from 'multer'

const bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/books')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, Date.now() + '-' + file.originalname)
  },
})

export const upload = multer({ storage: bookStorage })
