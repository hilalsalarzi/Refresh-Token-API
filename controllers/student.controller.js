import studentService from '../services/student.service.js';
import { sendResponse } from '../helpers/response.js';

export default {
  createStudent: async (req, res) => {
    try {
      const student = await studentService.createStudent(req.body, req.file);
      // res.status(201).json(student);
      sendResponse(res, 201, true, 'Student created successfully', student);
    } catch (err) {
      sendResponse(res, 500, false, err.message, null);
    }
  },

  getStudents: async (req, res) => {
    try {
      const students = await studentService.getAllStudents();
      sendResponse(res, 200, true, 'Students retrieved successfully', students);
    } catch (err) {
      sendResponse(res, 500, false, err.message, null);
    }
  },

  getStudent: async (req, res) => {
    try {
      const student = await studentService.getStudentById(req.params.id);
      if (!student) return sendResponse(res, 404, false, 'Student not found', null);
      sendResponse(res, 200, true, 'Student retrieved successfully', student);
    } catch (err) {
      sendResponse(res, 500, false, err.message, null);
    }
  },

  updateStudent: async (req, res) => {
    try {
      const updatedStudent = await studentService.updateStudent(req.params.id, req.body, req.file);
      sendResponse(res, 200, true, 'Student updated successfully', updatedStudent);
    } catch (err) {
      sendResponse(res, 500, false, err.message, null);
    }
  },

  deleteStudent: async (req, res) => {
    try {
      await studentService.deleteStudent(req.params.id);
      sendResponse(res, 200, true, 'Student deleted successfully', null);
    } catch (err) {
      sendResponse(res, 500, false, err.message, null);
    }
  },
};
