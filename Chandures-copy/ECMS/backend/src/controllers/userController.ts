import { Request, Response } from 'express';
import User from '../models/User';

export const addUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving user' });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // fetch from MongoDB
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
