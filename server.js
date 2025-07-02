const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

let users = [];
let resetTokens = {};
const usersFile = path.join(__dirname, 'users.json');

if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Gmail transporter (replace with your Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'joyboy5546@gmail.com',
    pass: 'odzfqzgvgtvxmkro'
  }
});

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });
  saveUsers();
  res.json({ message: 'Registered successfully.' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  res.json({ message: `Welcome, ${user.username}` });
});

// Forgot
app.post('/forgot', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'Email not found.' });

  const token = crypto.randomBytes(32).toString('hex');
  resetTokens[token] = email;

  const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;
  const mailOptions = {
    from: 'joyboy5546@gmail.com',
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h3>Password Reset</h3>
      <p>Hello ${user.username},</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
    `
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.status(500).json({ message: 'Email failed.' });
    res.json({ message: 'Reset link sent to your email.' });
  });
});

// Reset
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const email = resetTokens[token];
  if (!email) return res.status(400).json({ message: 'Invalid token.' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.password = await bcrypt.hash(newPassword, 10);
  saveUsers();
  delete resetTokens[token];

  res.json({ message: 'Password updated.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
