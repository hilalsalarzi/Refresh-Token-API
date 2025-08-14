// dbconnect.js
import mongoose from 'mongoose';

const dbconnect = () => {
  const fullURI = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

  mongoose.connect(fullURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));
};

export default dbconnect;
