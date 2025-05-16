// backend/server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());  // <-- body parser middleware before POST routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
  res.send("✅ Temple Management Backend is Running");
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });
  
 

// Serve static files from /public
app.use('/', express.static(path.join(__dirname, '../public')));

// Serve static files from /admin (requires login, but we'll handle that later)
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Helper to read/write JSON files
const readData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
};
const users = [
    { username: "admin", password: "temple123" } // Simple hardcoded user
  ];
  

const writeData = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Donations
app.get('/api/donations', (req, res) => {
  const donations = readData('donations.json');
  res.json(donations);
});

app.post('/api/donations', (req, res) => {
  const donations = readData('donations.json');
  donations.push(req.body);
  writeData('donations.json', donations);
  res.status(201).json({ message: 'Donation added' });
});
// Update a donation by index
app.put('/api/donations/:index', (req, res) => {
    const donations = readData('donations.json');
    const index = parseInt(req.params.index, 10);
    if (index < 0 || index >= donations.length) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    donations[index] = req.body; // Update with new data
    writeData('donations.json', donations);
    res.json({ message: 'Donation updated' });
  });
  
  // Delete a donation by index
  app.delete('/api/donations/:index', (req, res) => {
    const donations = readData('donations.json');
    const index = parseInt(req.params.index, 10);
    if (index < 0 || index >= donations.length) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    donations.splice(index, 1); // Remove the donation from array
    writeData('donations.json', donations);
    res.json({ message: 'Donation deleted' });
  });
  

// Expenses
app.get('/api/expenses', (req, res) => {
  const expenses = readData('expenses.json');
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const expenses = readData('expenses.json');
  expenses.push(req.body);
  writeData('expenses.json', expenses);
  res.status(201).json({ message: 'Expense added' });
});
app.post('/api/expenses', upload.single('image'), (req, res) => {
    const expenses = readData('expenses.json');
    const expense = JSON.parse(req.body.data); // data sent as string
    if (req.file) {
      expense.image = `/uploads/${req.file.filename}`;
    }
    expenses.push(expense);
    writeData('expenses.json', expenses);
    res.status(201).json({ message: 'Expense added' });
  });
// Events
app.get('/api/events', (req, res) => {
  const events = readData('events.json');
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const events = readData('events.json');
  events.push(req.body);
  writeData('events.json', events);
  res.status(201).json({ message: 'Event added' });
});

// Donors
app.get('/api/donors', (req, res) => {
  const donors = readData('donors.json');
  res.json(donors);
});

app.post('/api/donors', (req, res) => {
  const donors = readData('donors.json');
  donors.push(req.body);
  writeData('donors.json', donors);
  res.status(201).json({ message: 'Donor added' });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
