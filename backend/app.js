const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const applicationsRoutes = require('./routes/applications');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Unstop Clone Backend API is running');
});

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/admin', adminRoutes);
app.use('/applications', applicationsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 