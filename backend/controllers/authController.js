const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }
    const user = { id: result.insertId, name, email, role };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user, token });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  });
};

exports.updateProfile = (req, res) => {
  const user_id = req.user.id;
  const { name, password } = req.body;
  let sql = 'UPDATE users SET ';
  const params = [];
  if (name) {
    sql += 'name = ?';
    params.push(name);
  }
  if (password) {
    if (params.length) sql += ', ';
    sql += 'password = ?';
    params.push(bcrypt.hashSync(password, 10));
  }
  sql += ' WHERE id = ?';
  params.push(user_id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'Profile updated' });
  });
}; 