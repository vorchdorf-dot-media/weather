import mongoose from 'mongoose';

const { MONGO_USER, MONGO_PASSWORD, MONGO_URL } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_URL) {
  throw new Error('No sufficient MongoDB credentials set!');
}

const CONNECTION = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}?retryWrites=true&w=majority`;
const connect = async (): Promise<typeof mongoose> => mongoose.connect(CONNECTION);

export default connect;