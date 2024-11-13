const express = require('express');
const { uploadFile, getFiles } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/upload', authMiddleware, uploadFile);
router.get('/', authMiddleware, getFiles);

module.exports = router;
