import mongoose from 'mongoose';

if (
  !process.env.MONGO_USER ||
  !process.env.MONGO_PASSWORD ||
  !process.env.MONGO_URL
) {
  throw new Error('No sufficient MongoDB credentials set!');
}

const CONNECTION = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}?retryWrites=true&w=majority`;
const connect = async (): Promise<typeof mongoose> =>
  mongoose.connect(CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

export default connect;
