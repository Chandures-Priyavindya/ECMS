import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();

// Enable CORS for your frontend origin
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// Mount routes under /api so frontend calls to /api/signin work
app.use('/api', authRoutes);


app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});


