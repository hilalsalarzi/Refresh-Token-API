import studentRepository from '../repositories/student.repository.js';
import Student from '../models/students.model.js';

export default {
  createStudent: async (studentData, file) => {
    if (file) {
      studentData.profilePicture = file.path; // Already processed by middleware
    }
    const student = new Student(studentData);
    return studentRepository.save(student);
  },

  getAllStudents: () => studentRepository.findAll(),

  getStudentById: (id) => studentRepository.findById(id),

  updateStudent: async (id, updateData, file) => {
    if (file) {
      updateData.profilePicture = file.path;
    }
    return studentRepository.updateById(id, updateData);
  },

  deleteStudent: (id) => studentRepository.deleteById(id),
};
