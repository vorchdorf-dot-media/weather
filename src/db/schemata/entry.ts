import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

const EntrySchema = new Schema({
  _id: {
    default: () => nanoid(),
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  updatedAt: Date,
  hash: {
    required: true,
    type: String,
  },
  timestamp: {
    required: true,
    type: Date,
  },
  temperature: {
    required: true,
    type: Number
  },
  temperature2: Number,
  humididty: Number,
  feels: Number,
});

export default EntrySchema;