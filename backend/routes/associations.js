const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllAssociations,
  getAssociationById,
  createAssociation,
  updateAssociation,
  uploadLogo,
  verifyAssociation,
  deleteAssociation
} = require('../controllers/associationController');

// @route   GET /api/associations
// @desc    Get all associations
// @access  Public
router.get('/', getAllAssociations);

// @route   GET /api/associations/:id
// @desc    Get association by ID
// @access  Public
router.get('/:id', getAssociationById);

// @route   POST /api/associations
// @desc    Create new association
// @access  Private
router.post('/', protect, createAssociation);

// @route   PUT /api/associations/:id
// @desc    Update association
// @access  Private (Association admin)
router.put('/:id', protect, authorize('association', 'admin'), updateAssociation);

// @route   POST /api/associations/:id/logo
// @desc    Upload association logo
// @access  Private (Association admin)
router.post('/:id/logo', protect, authorize('association', 'admin'), upload.single('logo'), uploadLogo);

// @route   PUT /api/associations/:id/verify
// @desc    Verify association
// @access  Private/Admin
router.put('/:id/verify', protect, authorize('admin'), verifyAssociation);

// @route   DELETE /api/associations/:id
// @desc    Delete association
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteAssociation);

module.exports = router;