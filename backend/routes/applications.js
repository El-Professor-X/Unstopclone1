const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getMyApplications, getApplicationsForOrganizer, updateApplicationStatus, getAllApplications } = require('../controllers/applicationsController');

// Student: view their applications
router.get('/my', authenticate, authorizeRoles('student'), getMyApplications);
// Organizer: view applications to their posts
router.get('/organizer', authenticate, authorizeRoles('company', 'college'), getApplicationsForOrganizer);
// Organizer: update application status
router.patch('/:id/status', authenticate, authorizeRoles('company', 'college'), updateApplicationStatus);
// Admin: view all applications
router.get('/all', require('../middleware/auth').authenticate, require('../middleware/auth').authorizeRoles('admin'), getAllApplications);

module.exports = router; 