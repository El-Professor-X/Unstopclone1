const db = require('../config/db');

exports.getAllPosts = (req, res) => {
  const search = req.query.search;
  let sql = `SELECT p.*, u.name as organizer_name, u.role as organizer_role FROM posts p JOIN users u ON p.organizer_id = u.id`;
  let params = [];
  if (search) {
    sql += ' WHERE p.title LIKE ? OR p.description LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

exports.createPost = (req, res) => {
  const { title, description, type, deadline } = req.body;
  const organizer_id = req.user.id;
  const organizer_role = req.user.role;
  if (!title || !description || !type || !deadline) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const sql = 'INSERT INTO posts (title, description, type, deadline, organizer_id, organizer_role) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, description, type, deadline, organizer_id, organizer_role], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ id: result.insertId, title, description, type, deadline, organizer_id, organizer_role });
  });
};

exports.getPostById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Post not found' });
    res.json(results[0]);
  });
};

exports.applyToPost = (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.id;
  const sql = 'INSERT INTO applications (user_id, post_id) VALUES (?, ?)';
  db.query(sql, [user_id, post_id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Already applied to this post' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'Application submitted' });
  });
}; 