const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {todos , users} = require("../localServerData/data.js");

async function handelSignup (req, res){
  const { email, password } = req.body;

  const userExists = users.find((user) => user.email === email);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: users.length + 1, email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
};


async function handelLogin (req, res){
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
};

module.exports = { handelSignup, handelLogin }