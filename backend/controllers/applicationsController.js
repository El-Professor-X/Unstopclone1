const db = require('../config/db');

exports.getMyApplications = (req, res) => {
  const user_id = req.user.id;
  const sql = `SELECT a.id as application_id, a.status as application_status, a.applied_at, p.*
               FROM applications a
               JOIN posts p ON a.post_id = p.id
               WHERE a.user_id = ?`;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

exports.getApplicationsForOrganizer = (req, res) => {
  const organizer_id = req.user.id;
  const sql = `SELECT a.id as application_id, a.status, a.applied_at, u.id as student_id, u.name as student_name, u.email as student_email, p.title
               FROM applications a
               JOIN posts p ON a.post_id = p.id
               JOIN users u ON a.user_id = u.id
               WHERE p.organizer_id = ?`;
  db.query(sql, [organizer_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

exports.updateApplicationStatus = (req, res) => {
  const organizer_id = req.user.id;
  const application_id = req.params.id;
  const { status } = req.body; // 'accepted' or 'rejected'
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  // Ensure the organizer owns the post for this application
  const sql = `
    UPDATE applications a
    JOIN posts p ON a.post_id = p.id
    SET a.status = ?
    WHERE a.id = ? AND p.organizer_id = ?
  `;
  db.query(sql, [status, application_id, organizer_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found or not authorized' });
    res.json({ message: `Application status updated to ${status}` });
  });
};

exports.updateApplicationByAdmin = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status && !['applied', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const fields = [];
  const params = [];
  if (status) {
    fields.push('status = ?');
    params.push(status);
  }
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }
  params.push(id);
  const sql = `UPDATE applications SET ${fields.join(', ')} WHERE id = ?`;
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'Application updated' });
  });
};

exports.getAllApplications = (req, res) => {
  const sql = `SELECT a.id as application_id, a.status, a.applied_at, u.id as student_id, u.name as student_name, u.email as student_email, p.title, p.type
               FROM applications a
               JOIN posts p ON a.post_id = p.id
               JOIN users u ON a.user_id = u.id`;
  db.query(sql, [], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
}; 