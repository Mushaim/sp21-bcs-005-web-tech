const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const server = express();

server.use(cors());
server.use(express.static('public'));
server.use(expressLayouts);
server.set('view engine', 'ejs');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/taskManager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// User Model Schema
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
});

// Registration Endpoint
server.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Registration failed');
  }
});

// Login Endpoint
server.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    // Check if the entered password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    res.status(200).send('Login successful');
  } catch (error) {
    res.status(500).send('Login failed');
  }
});

server.listen(5000, () => {
  console.log('Server started on port 5000');
});
