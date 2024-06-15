import http from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to serve static files from the os-utils/apps directory
app.use('/apps', express.static(path.join(__dirname, 'os-utils', 'apps')));

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
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
