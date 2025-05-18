// backend/server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static files serving
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Multer setup for file uploads
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

// Helper functions to read and write JSON files
const readData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
};

const writeData = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Hardcoded users
const users = [
  { username: "admin", password: "temple123" }
];

// CRUD utility function
function setupCrudRoutes(entityName, uploadFile = false) {
  const filename = `${entityName}.json`;

  app.get(`/api/${entityName}`, (req, res) => {
    const data = readData(filename);
    res.json(data);
  });

  app.get(`/api/${entityName}/:id`, (req, res) => {
    const data = readData(filename);
    const item = data.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ message: `${entityName.slice(0,-1)} not found` });
    res.json(item);
  });

  if (uploadFile) {
    app.post(`/api/${entityName}`, upload.single('image'), (req, res) => {
      const data = readData(filename);
      let newItem = req.file ? JSON.parse(req.body.data) : req.body;
      if (req.file) {
        newItem.image = `/uploads/${req.file.filename}`;
      }
      newItem.id = uuidv4();
      data.push(newItem);
      writeData(filename, data);
      res.status(201).json({ message: `${entityName.slice(0,-1)} added`, item: newItem });
    });
  } else {
    app.post(`/api/${entityName}`, (req, res) => {
      const data = readData(filename);
      const newItem = { id: uuidv4(), ...req.body };
      data.push(newItem);
      writeData(filename, data);
      res.status(201).json({ message: `${entityName.slice(0,-1)} added`, item: newItem });
    });
  }

  app.put(`/api/${entityName}/:id`, (req, res) => {
    const data = readData(filename);
    const id = req.params.id;
    const index = data.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ message: `${entityName.slice(0,-1)} not found` });
    data[index] = { id, ...req.body };
    writeData(filename, data);
    res.json({ message: `${entityName.slice(0,-1)} updated` });
  });

  app.delete(`/api/${entityName}/:id`, (req, res) => {
    const data = readData(filename);
    const id = req.params.id;
    const index = data.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ message: `${entityName.slice(0,-1)} not found` });
    data.splice(index, 1);
    writeData(filename, data);
    res.json({ message: `${entityName.slice(0,-1)} deleted` });
  });
}

// CRUD routes
setupCrudRoutes('donations');
setupCrudRoutes('donors');
setupCrudRoutes('expenses', true);
setupCrudRoutes('events');
setupCrudRoutes('reports');

// Derived donor report
app.get('/api/derived-donors', (req, res) => {
  const donations = readData('donations.json');
  const eventFilter = req.query.event;

  const donorMap = new Map();
  donations.forEach(d => {
    if (eventFilter && d.event !== eventFilter) return;
    const key = `${d.name}-${d.mobile}`;
    if (!donorMap.has(key)) {
      donorMap.set(key, {
        name: d.name,
        mobile: d.mobile,
        email: d.email || '',
        address: d.address || '',
        totalAmount: 0,
        count: 0
      });
    }
    const donor = donorMap.get(key);
    donor.totalAmount += parseFloat(d.amount);
    donor.count++;
  });

  res.json(Array.from(donorMap.values()));
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
});

// Root
app.get("/", (req, res) => {
  res.send("✅ Temple Management Backend is Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
