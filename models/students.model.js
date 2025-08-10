import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    course: { 
        type: String,
        required: true 
    },
    profilePicture: { 
        type: String,
        required: false 
    }
});
const Student = mongoose.model('Student', studentSchema);
export default Student;