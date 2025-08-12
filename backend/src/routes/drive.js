const express = require('express');
const router = express.Router();

router.post('/upload', (req, res) => {
  // TODO: Implement authentication/authorization
  // TODO: Retrieve access_token from DB using deviceId
  // TODO: Use Google Drive API to upload file
  res.json({ message: 'Drive upload endpoint reached' });
});

module.exports = router;
