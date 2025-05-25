const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/donations.json');

const readData = () => {
  if (!fs.existsSync(dataPath)) return [];
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// GET all donations
router.get('/api/donations', (req, res) => {
  const donations = readData();
  res.json(donations);
});

// POST new donation
router.post('/api/donations', (req, res) => {
  const { name, mobile, email, address, amount, date, event } = req.body;

  const newDonation = {
    id: uuidv4(),
    name,
    mobile,
    email,
    address,
    amount,
    date,
    event
  };

  const donations = readData();
  donations.push(newDonation);
  writeData(donations);

  res.status(201).json({ success: true, message: 'Donation added', donation: newDonation });
});

// PUT update donation
router.put('/api/donations/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const donations = readData();
  const index = donations.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Donation not found' });
  }

  donations[index] = { ...donations[index], ...updatedData };
  writeData(donations);

  res.json({ success: true, message: 'Donation updated' });
});

// DELETE donation
router.delete('/api/donations/:id', (req, res) => {
  const { id } = req.params;

  let donations = readData();
  const originalLength = donations.length;
  donations = donations.filter(d => d.id !== id);

  if (donations.length === originalLength) {
    return res.status(404).json({ success: false, message: 'Donation not found' });
  }

  writeData(donations);
  res.json({ success: true, message: 'Donation deleted' });
});

module.exports = router;
