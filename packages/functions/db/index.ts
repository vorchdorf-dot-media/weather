import mongoose, { connect, connection } from 'mongoose';

import { isTest } from '../utils/definitions';

if (
  !process.env.MONGO_USER ||
  !process.env.MONGO_PASSWORD ||
  !process.env.MONGO_URL
) {
  throw new Error('Insufficient MongoDB credentials set!');
}

const CONNECTION = isTest()
  ? process.env.MONGO_URL
  : `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}?retryWrites=true&w=majority&ssl=true&authSource=admin`;

const client = async (): Promise<typeof mongoose> =>
  connect(CONNECTION, {
    bufferCommands: false,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

connection.on('error', console.error.bind(console, 'MongoDB Error:'));
connection.once('open', () =>
  console.log(
    `MongoDB connection to ${process.env.MONGO_URL} with user "${process.env.MONGO_USER}" succeeded!`
  )
);

export default client;
