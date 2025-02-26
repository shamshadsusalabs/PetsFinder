const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config');

// Multer storage configuration with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads', // Common folder for all images
      format: file.mimetype.split('/')[1], // Automatically detect format
      public_id: file.fieldname + '-' + Date.now(), // Unique filename
    };
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

// ✅ Single middleware to handle `image` or `profilePic` dynamically
const uploadImage = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        req.body[file.fieldname] = file.path; // Save Cloudinary URL in req.body
      });
    }

    next();
  });
};

module.exports = { uploadImage };
