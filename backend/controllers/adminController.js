const db = require('../config/db');

exports.getAllUsers = (req, res) => {
  db.query('SELECT id, name, email, role, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

exports.getAllPosts = (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

exports.editPost = (req, res) => {
  const { id } = req.params;
  const { title, description, type, deadline, status } = req.body;
  const sql = 'UPDATE posts SET title=?, description=?, type=?, deadline=?, status=? WHERE id=?';
  db.query(sql, [title, description, type, deadline, status, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'Post updated' });
  });
};

exports.deletePost = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'Post deleted' });
  });
};

exports.updatePostStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  db.query('UPDATE posts SET status=? WHERE id=?', [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: `Post status updated to ${status}` });
  });
};

exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['student', 'college', 'company', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  db.query('UPDATE users SET role=? WHERE id=?', [role, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'User role updated' });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'User deleted' });
  });
}; 