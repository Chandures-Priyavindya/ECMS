import { Router } from 'express';
import bcrypt from 'bcrypt';
import connectDB from '../db.js'; 

const router = Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, companyName, role, password, termsAccepted } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !companyName || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!termsAccepted) {
    return res.status(400).json({ error: 'You must accept the terms and conditions to create an account.' });
  }

  try {
    const client = await connectDB(); 
    console.log("client:", client); 
    const db = client.db('myapp');    
    const users = db.collection('users'); 

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyName,
      passwordHash,
      termsAccepted: true,
      createdAt: new Date(),
    };

    await users.insertOne(newUser);

    return res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error creating user:', error.message, error.stack);
    return res.status(500).json({ error: 'Error creating user. Please try again later.' });
  }
});

// SIGNIN
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const client = await connectDB(); 
    const db = client.db('myapp');    
    const users = db.collection('users'); 

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    return res.status(200).json({ message: 'Signin successful.' });
  } catch (error) {
    console.error(' Error signing in:', error.message, error.stack);
    return res.status(500).json({ error: 'Error signing in. Please try again later.' });
  }
});

export default router;

