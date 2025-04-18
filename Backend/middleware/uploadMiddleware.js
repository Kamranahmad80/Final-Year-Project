import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = file.fieldname === 'logo' ? 'uploads/logos/' : 'uploads/resumes/';
    cb(null, uploadDir); // Make sure these folders exist or create them
  },
  filename(req, file, cb) {
    // Use original name plus timestamp for uniqueness
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type filter for resumes
const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application/pdf") ||
      file.mimetype.startsWith("application/msword") ||
      file.mimetype.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  ) {
    cb(null, true);
  } else {
    cb("File type not supported", false);
  }
};

// File type filter for logos (images)
const logoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb("Only image files are allowed", false);
  }
};

// Determine which file filter to use based on fieldname
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    resumeFileFilter(req, file, cb);
  } else if (file.fieldname === 'logo') {
    logoFileFilter(req, file, cb);
  } else {
    cb("Unknown file type", false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
