import { Schema, model } from 'mongoose';
import { customAlphabet } from 'nanoid';

import { BASE_58, ID_LONG } from '../../utils/definitions';

const nanoid = customAlphabet(BASE_58, ID_LONG);

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
  humidity: Number,
  feels: Number,
});

EntrySchema.set('toJSON', { virtuals: true });

export default model('Entry', EntrySchema);
