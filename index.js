import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import dbconnect from './config/database.js';
const app = express();
const PORT = process.env.PORT || 3000;
// urlencoded
app.use(urlencoded({ extended: false }));
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
dbconnect();
// Import routes
import studentRoutes from './routes/students.routes.js';
// Use routes
app.use('/api', studentRoutes); 
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