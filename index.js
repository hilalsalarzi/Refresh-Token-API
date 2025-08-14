import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import dbconnect from './config/database.js';
const app = express();
import rateLimit from 'express-rate-limit'; // Import rate limiting middleware
import cors from 'cors'
import helmet from 'helmet'; // Import helmet for security headers
import auth from './middleware/auth.js';
import slowDown from 'express-slow-down'; // Import slow down middleware
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
// urlencoded
app.use(urlencoded({ extended: false }));
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
dbconnect();
// Import routes
import studentRoutes from './routes/students.routes.js';
import userRoutes from './routes/users.routes.js';
// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." },
  });
app.use(limiter); // Apply rate limiting middleware
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // Allow 100 requests per 15 minutes without delay
    delayMs: 500, // Add 500ms delay per request above delayAfter
    maxDelayMs: 5000 // Optional: cap the max delay
  });
  app.use(speedLimiter);
// Use helmet to set security-related HTTP headers
app.use(helmet());
// Use routes
app.use(cors()); // Enable CORS for all routes
app.use('/api', userRoutes);
// app.use('/api', studentRoutes);
// app.use(auth); // Apply authentication middleware to all routes
app.use('/api',auth, studentRoutes); 

// error handling middleware  use multer 
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(500).json({ message: 'someting Went wrong' });
    }
    next();
});

// Start the server     
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});