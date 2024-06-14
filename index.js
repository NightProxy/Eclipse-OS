const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Route to get apps dynamically
app.get('/api/apps', (req, res) => {
  const appsDir = path.join(__dirname, 'os-utils', 'apps');
  const apps = [];

  fs.readdirSync(appsDir).forEach(dir => {
    const appPath = path.join(appsDir, dir, 'app.json');
    if (fs.existsSync(appPath)) {
      const appConfig = JSON.parse(fs.readFileSync(appPath, 'utf-8'));
      apps.push(appConfig);
    }
  });

  res.json(apps);
});

// Serve React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
