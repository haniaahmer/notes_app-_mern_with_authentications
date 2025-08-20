import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST upload image
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });
  const fileUrl = `http://localhost:8000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
