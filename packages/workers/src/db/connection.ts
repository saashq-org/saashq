import * as dotenv from 'dotenv';
import mongoose = require('mongoose');

dotenv.config();

const { NODE_ENV, MONGO_URL = 'mongodb://localhost/saashq' } = process.env;

export const connectionOptions: mongoose.ConnectOptions = {
  family: 4,
};

mongoose.Promise = global.Promise;

mongoose.connection
  .on('connected', () => {
    if (NODE_ENV !== 'test') {
      console.log(`Connected to the database: ${MONGO_URL}`);
    }
  })
  .on('disconnected', () => {
    console.log(`Disconnected from the database: ${MONGO_URL}`);
  })
  .on('error', (error) => {
    console.log(`Database connection error: ${MONGO_URL} ${error}`);
  });

export const connect = async (URL?: string, options?) => {
  return mongoose.connect(URL || MONGO_URL, {
    ...connectionOptions,
    ...(options || { maxPoolSize: 100 }),
  });
};

export function disconnect() {
  return mongoose.connection.close();
}

/**
 * Health check status
 */
export const mongoStatus = async () => {
  return mongoose.connection.db.admin().ping();
};
