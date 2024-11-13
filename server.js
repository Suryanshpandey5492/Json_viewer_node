// const express = require('express');
// const bodyParser = require('body-parser');
// const authRoutes = require('./routes/authRoutes');
// const fileRoutes = require('./routes/fileRoutes');
// const path = require('path');
// const https = require('https')
// const fs = require('fs')

// require('dotenv').config();
// const app = express();
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes for frontend views
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'login.html'));
// });

// app.get('/register', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'register.html'));
// });

// app.get('/files', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'files.html'));
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/files', fileRoutes);

// // Redirect root to login page
// app.get('/', (req, res) => res.redirect('/login'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');
const https = require('https');
const fs = require('fs');
const http = require('http'); // For redirecting HTTP to HTTPS

require('dotenv').config();
const app = express();

// Middleware for parsing JSON data
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

// Read the SSL certificate and key files
const options = {
  key: fs.readFileSync('cert/key.pem'),  // Path to the private key
  cert: fs.readFileSync('cert/cert.pem'),  // Path to the certificate
};

// Create an HTTPS server with the SSL certificate
https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// Redirect HTTP traffic to HTTPS
const httpApp = express();
httpApp.use((req, res, next) => {
  if (req.protocol !== 'https') {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  next();
});

// HTTP server to handle redirects from HTTP to HTTPS
http.createServer(httpApp).listen(80, () => {
  console.log('HTTP Server running on port 80, redirecting to HTTPS');
});
