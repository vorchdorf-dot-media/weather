import mongoose, { connect, connection } from 'mongoose';

if (
  !process.env.MONGO_USER ||
  !process.env.MONGO_PASSWORD ||
  !process.env.MONGO_URL
) {
  throw new Error('No sufficient MongoDB credentials set!');
}

const CONNECTION = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}?retryWrites=true&w=majority&ssl=true&authSource=admin`;
const client = async (): Promise<typeof mongoose> =>
  connect(CONNECTION, {
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
