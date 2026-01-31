const express = require('express');
const { body, validationResult } = require('express-validator');
const Subject = require('../models/Subject');
const Material = require('../models/Material');
const { auth, adminAuth } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');
const fileUpload = require('express-fileupload');

const router = express.Router();

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY 
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

const supabaseAdmin = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'not exists');
console.log('supabaseAdmin initialized:', !!supabaseAdmin);

// Use file upload middleware
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true
}));

// Get all subjects
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find().populate('createdBy', 'name');
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create subject (admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Subject name is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const subject = new Subject({
      name,
      description,
      createdBy: req.user.userId
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get materials for a subject
router.get('/:subjectId/materials', auth, async (req, res) => {
  try {
    const materials = await Material.find({ subject: req.params.subjectId })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload material (admin only)
router.post('/:subjectId/materials', adminAuth, async (req, res) => {
  try {
    // Check if subject exists
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ message: 'File storage not configured' });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file;
    const { title, description } = req.body;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'text/plain'
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, and TXT files are allowed.' });
    }

    // Upload to Supabase
    const bucketName = 'study-materials';
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    console.log('Uploading file:', fileName, 'Size:', file.size, 'Mimetype:', file.mimetype);
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, file.data, {
        contentType: file.mimetype
      });

    if (error) {
      console.error('Supabase upload error:', error);
      console.error('Upload error:', error);
      return res.status(500).json({ message: `File upload failed: ${error.message}. Please ensure the storage bucket exists and is configured correctly.` });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    // Save to database
    const material = new Material({
      title,
      description,
      subject: req.params.subjectId,
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedBy: req.user.userId
    });

    await material.save();
    res.status(201).json(material);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download material
router.get('/materials/:materialId/download', auth, async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ message: 'File storage not configured' });
    }

    const material = await Material.findById(req.params.materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Increment download count
    material.downloads += 1;
    await material.save();

    res.json({ downloadUrl: material.fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;