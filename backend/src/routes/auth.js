const express = require('express');
const { google } = require('googleapis');
const { encrypt } = require('../utils/encryption');
const db = require('../database');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get('/start', (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId required' });
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    state: deviceId,
  });

  res.json({ authUrl });
});

router.get('/oauth2callback', async (req, res) => {
  const { code, state } = req.query; // state = deviceId

  if (!code || !state) {
    return res.status(400).send('Missing code or state parameter.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const encryptedRefreshToken = encrypt(tokens.refresh_token);

    // Save tokens to database
    const stmt = db.prepare(
      `INSERT OR REPLACE INTO oauth_tokens (
        device_id, google_user_id, refresh_token_encrypted, access_token, expires_at
      ) VALUES (?, ?, ?, ?, ?)`
    );
    stmt.run(
      state, // deviceId
      tokens.id_token, // Using id_token as google_user_id for now, will refine later if needed
      encryptedRefreshToken,
      tokens.access_token,
      tokens.expiry_date
    );

    res.send('Autenticação concluída. Você pode fechar esta janela.');
  } catch (error) {
    console.error('Error retrieving access token or saving to DB:', error);
    res.status(500).send('Authentication failed.');
  }
});

router.get('/status', (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId required' });
  }

  try {
    const stmt = db.prepare('SELECT device_id FROM oauth_tokens WHERE device_id = ?');
    const token = stmt.get(deviceId);
    res.json({ authenticated: !!token });
  } catch (error) {
    console.error('Error checking authentication status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
