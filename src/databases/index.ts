import mongoose, { Mongoose } from 'mongoose';
import config from '../config/config';

const connectDatabase = async (): Promise<Mongoose> => {
  return mongoose.connect(config.mongoose.url);
};

export default connectDatabase;
