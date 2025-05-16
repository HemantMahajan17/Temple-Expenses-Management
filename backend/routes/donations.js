const express = require('express');
const router = express.Router();

let donations = []; // Temporary in-memory array

// Get all donations
router.get('/', (req, res) => {
  res.json(donations);
});

// Add new donation
router.post('/', (req, res) => {
  const donation = req.body;
  donation.id = donations.length + 1;
  donation.date = new Date();
  donations.push(donation);
  res.status(201).json(donation);
});

module.exports = router;
