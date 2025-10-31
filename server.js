const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// --- Setup ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Connect to MongoDB Atlas ---
// Make sure 'sahautsav224_db_user' and password 'DVUFRHbzbVkP22Qt' correspond to your Atlas Database User.
mongoose.connect(
  'mongodb+srv://sahautsav224_db_user:DVUFRHbzbVkP22Qt@cluster0.upph7a6.mongodb.net/userdb?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// --- MongoDB Schema & Model ---
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// --- Signup API ---
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    res.json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// --- Login API ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- Default Route ---
app.get('/', (req, res) => {
  res.send('Backend Server Running');
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));