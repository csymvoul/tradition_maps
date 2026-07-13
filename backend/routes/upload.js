const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const requireAuth = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Store originals in a temp subfolder; sharp will write the final file
const tmpDir = path.join(uploadDir, 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB before resize
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Μόνο εικόνες επιτρέπονται'));
  }
});

// POST /api/upload
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Δεν επιλέχθηκε αρχείο' });

  const outName = path.basename(req.file.filename, path.extname(req.file.filename)) + '.webp';
  const outPath = path.join(uploadDir, outName);

  try {
    await sharp(req.file.path)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);

    fs.unlinkSync(req.file.path); // remove temp original
    res.json({ url: `/uploads/${outName}` });
  } catch (err) {
    console.error('Image processing error:', err);
    res.status(500).json({ error: 'Αποτυχία επεξεργασίας εικόνας' });
  }
});

module.exports = router;
