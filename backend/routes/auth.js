const express = require('express');
const router = express.Router();

// Hardcoded admin user for demo
const adminUser = { username: 'admin', password: 'temple123' };

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminUser.username && password === adminUser.password) {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
