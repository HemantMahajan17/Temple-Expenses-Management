// backend/server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express(); // ✅ defined before use
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Multer setup
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

// Helper functions
const readData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
};

const writeData = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// CRUD Utility Function
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
    const index = data.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: `${entityName.slice(0,-1)} not found` });
    data[index] = { id: req.params.id, ...req.body };
    writeData(filename, data);
    res.json({ message: `${entityName.slice(0,-1)} updated` });
  });

  app.delete(`/api/${entityName}/:id`, (req, res) => {
    const data = readData(filename);
    const index = data.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: `${entityName.slice(0,-1)} not found` });
    data.splice(index, 1);
    writeData(filename, data);
    res.json({ message: `${entityName.slice(0,-1)} deleted` });
  });
}

// Setup routes
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



// 🔐 Enhanced LOGIN with mobile fallback and password reset
app.post('/api/login', (req, res) => {
  const { username, password, mobile, resetPassword } = req.body;
  const users = readData('users.json');

  // 1. Normal login by username + password
  if (username && password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please contact admin for password.' });
    }
    return res.json({ message: 'Login successful', user });
  }

  // 2. Login using mobile (for password reset)
  if (mobile) {
    const user = users.find(u => u.mobile === mobile);
    if (!user) {
      return res.status(404).json({ message: 'Mobile number not found. Contact admin.' });
    }

    if (resetPassword) {
      // Set new password
      user.password = resetPassword;
      writeData('users.json', users);
      return res.json({ message: 'Password reset successful. Please log in again.' });
    } else {
      // First mobile login: force password reset
      return res.json({ message: 'Mobile verified. Please reset your password.', user, needsReset: true });
    }
  }

  // 3. Fallback
  res.status(400).json({ message: 'Invalid request. Provide either username+password or mobile.' });
});

  // Update user by ID (for password change)
app.put('/api/users/:id', (req, res) => {
  const users = readData('users.json');
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const { password, mobile, ...otherFields } = req.body;

  // Update password if provided
  if (password) {
    users[userIndex].password = password;
  }

  // Optionally update mobile or other fields here if needed

  writeData('users.json', users);

  res.json({ message: 'User updated successfully' });
});



// 👤 USERS - POST
app.post('/api/users', (req, res) => {
  const users = readData('users.json');
  const newUser = { id: `u${Date.now()}`, ...req.body };
  users.push(newUser);
  writeData('users.json', users);
  res.status(201).json({ message: 'User created', user: newUser });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Temple Management Backend is Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
