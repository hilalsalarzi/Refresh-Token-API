import express from 'express';
import studentController from '../controllers/student.controller.js';
import upload, { processImage } from '../middleware/upload.js';
import auth from '../middleware/auth.js'; // JWT auth middleware

const router = express.Router();

router.post('/students', upload.single('profilePicture'), processImage, studentController.createStudent);
router.put('/students:id', upload.single('profilePicture'), processImage, studentController.updateStudent);

router.get('/students', studentController.getStudents);
router.get('/student:id', studentController.getStudent);
router.delete('/student:id', studentController.deleteStudent);

export default router;
