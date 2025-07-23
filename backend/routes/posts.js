const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getAllPosts, createPost, getPostById, applyToPost } = require('../controllers/postsController');

// Get all posts
router.get('/', authenticate, getAllPosts);
// Create a post (company or college only)
router.post('/', authenticate, authorizeRoles('company', 'college'), createPost);
// Get a single post by ID
router.get('/:id', authenticate, getPostById);
// Apply to a post (student only)
router.post('/:id/apply', authenticate, authorizeRoles('student'), applyToPost);

module.exports = router; 