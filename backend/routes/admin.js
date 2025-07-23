const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getAllUsers, getAllPosts, editPost, deletePost, updatePostStatus, updateUserRole, deleteUser } = require('../controllers/adminController');

// All routes require admin role
router.use(authenticate, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/posts', getAllPosts);
router.patch('/posts/:id', editPost);
router.delete('/posts/:id', deletePost);
router.patch('/posts/:id/status', updatePostStatus);
router.patch('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router; 