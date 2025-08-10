// Connect to MongoDB
import mongoose from 'mongoose';
const dbconnect=()=> {
mongoose.connect('mongodb://localhost:27017/apicrud').then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
}
export default dbconnect;