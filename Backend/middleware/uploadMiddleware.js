import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists or create it
  },
  filename(req, file, cb) {
    // Use original name plus timestamp for uniqueness
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application/pdf") ||
      file.mimetype.startsWith("application/msword") ||
      file.mimetype.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  ) {
    cb(null, true);
  } else {
    cb("File type not supported", false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
