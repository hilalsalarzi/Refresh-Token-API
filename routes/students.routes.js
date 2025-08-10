import express from 'express';
const router = express.Router();
import Student from '../models/students.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const newNamefile = Date.now()+path.extname(file.originalname);
        cb(null, newNamefile); // Append file
    }
});

// file filter to allow only images
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true); // Accept file
    } else {
        cb(new Error('Only images are allowed!'), false); // Reject file
    }
};


// Set up multer for file uploads
const upload= multer({
    storage: storage, // Directory to save uploaded files
    limits: 1024*1024*3, // Limit file size to 1MB
    fileFilter: fileFilter
});

// get students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// show one student 
router.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Create a new student
router.post('/students',upload.single('profilePicture'), async (req, res) => {
    try {
        // const student = await Student.create(req.body);
        const student = new Student({
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            course: req.body.course,
            profilePicture: req.file ? req.file.filename : null // Save the filename of the uploaded file
        });
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Update a student
router.put('/students/:id',upload.single('profilePicture'), async (req, res) => {
    try {
        const studentExists = await Student.findById(req.params.id);
        if (!studentExists) {
            return res.status(404).json({ message: 'Student not found' });
        }
    
        if (req.file) {
            const oldFilePath = path.join('uploads', studentExists.profilePicture);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            req.body.profilePicture = req.file.filename;
        }
    
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    
});
// Delete a student
router.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Delete the profile picture if it exists
        if (student.profilePicture) {
            const filePath = path.join('uploads', student.profilePicture);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the file

            }
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;