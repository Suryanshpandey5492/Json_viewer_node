const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');

require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes for frontend views
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/files', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'files.html'));
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Redirect root to login page
app.get('/', (req, res) => res.redirect('/login'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
