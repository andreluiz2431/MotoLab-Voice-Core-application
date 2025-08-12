const express = require('express');
const { google } = require('googleapis');
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
    // TODO: Encrypt and save tokens linked to deviceId
    res.send('Autenticação concluída. Você pode fechar esta janela.');
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send('Authentication failed.');
  }
});

module.exports = router;
