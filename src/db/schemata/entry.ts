import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

export interface EntrySchema {
  _id: string;
  createdAt: Date;
  updatedAt?: Date;
  station: string;
  hash: string;
  timestamp: Date;
  temperature: number;
  temperature2?: number;
  humidity?: number;
  feels?: number;
}

export const EntrySchema: Schema<EntrySchema> = new Schema({
  _id: {
    alias: 'id',
    default: () => nanoid(),
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  updatedAt: Date,
  station: {
    ref: 'Station',
    required: true,
    type: String,
  },
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
    type: Number,
  },
  temperature2: Number,
  humididty: Number,
  feels: Number,
});

export default model('Entry', EntrySchema);
