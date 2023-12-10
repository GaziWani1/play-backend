import multer from "multer";

const storage = multer.diskStorage({
    destinnation: function (req, res, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, res, cb) {
        cb(null, file.orginalname)
    }
})

export const upload = multer({ storage: storage })