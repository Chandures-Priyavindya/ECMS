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

// Delete User Route
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the user ID from the URL parameter
  try {
    const user = await User.findByIdAndDelete(id); // Delete the user by ID from the database

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // If no user found, return 404
    }

    res.status(200).json({ message: 'User deleted successfully' }); // If successful, return 200 status
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
