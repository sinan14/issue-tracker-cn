import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('db connecting...');
    const dbUrl =
      process.env.MONGO_URI || 'mongodb://localhost:27017/csv-upload';
    const res = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected with server ${res.connection.host}`);
  } catch (error) {
    console.log('mongodb connection failed!');
    console.log(error);
  }
};
