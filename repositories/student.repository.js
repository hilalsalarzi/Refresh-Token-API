import Student from '../models/students.model.js';

export default {
  findByEmail: (email) => Student.findOne({ email }),
  findById: (id) => Student.findById(id),
  findAll: () => Student.find(),
  save: (student) => student.save(),
  updateById: (id, data) => Student.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id) => Student.findByIdAndDelete(id),
};
