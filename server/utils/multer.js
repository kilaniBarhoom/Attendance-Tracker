import multer from "multer";
export const fileValidation = {
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    pdf: ['application/pdf']
}
function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({})
    const fileFilter = ((req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb("Invalid file format", false)
        }
    })

    return multer({ fileFilter, storage });
}

export default fileUpload;