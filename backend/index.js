require('dotenv').config();

const express = require('express');
const db = require('./src/database');
const authRoutes = require('./src/routes/auth');
const driveRoutes = require('./src/routes/drive');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/drive', driveRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database initialized and oauth_tokens table ensured.');
});
