import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// Multer config - store in temp/
const upload = multer({
  dest: 'temp/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) are allowed'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Middleware to process image after upload
export const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const uploadDir = path.join('uploads', 'students');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const finalPath = path.join(uploadDir, fileName);

    await sharp(req.file.path)
      .resize(800)
      .jpeg({ quality: 80 })
      .toFile(finalPath);

    fs.unlinkSync(req.file.path); // Remove temp file
    req.file.path = finalPath; // Update file path for service
    req.file.filename = fileName;

    next();
  } catch (err) {
    next(err);
  }
};

export default upload;
