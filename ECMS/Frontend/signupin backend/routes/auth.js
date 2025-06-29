import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import connectDB from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// SIGNUP
router.post('/signup', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    termsAccepted,
  } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!termsAccepted) {
    return res.status(400).json({
      error: 'You must accept the terms and conditions to create an account.',
    });
  }

  try {
    const db = await connectDB();
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
    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10d' });

    return res.status(200).json({
      message: 'Signin successful.',
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Error signing in:', error.message, error.stack);
    return res.status(500).json({ error: 'Error signing in. Please try again later.' });
  }
});

// GET /user - fetch user info
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { firstName: 1, lastName: 1, email: 1, phoneNumber: 1 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Returning user from DB:', user);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// update user info
router.put('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = await connectDB();
    const users = db.collection('users');

    const { firstName, lastName, phoneNumber } = req.body;

    const result = await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          firstName,
          lastName,
          phoneNumber,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'User update failed.' });
    }

    const updatedUser = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { firstName: 1, lastName: 1, email: 1, phoneNumber: 1 } }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Error updating user.' });
  }
});

export default router;

