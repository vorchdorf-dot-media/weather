import { Document, Schema, model } from 'mongoose';
import { customAlphabet } from 'nanoid';

import { BASE_58, ID_LONG } from '../../utils/definitions';
import { StationSchema } from './station';

const nanoid = customAlphabet(BASE_58, ID_LONG);

export type EntrySchema = {
  [key: string]: unknown;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  station: string | StationSchema;
  hash: string;
  timestamp: Date;
  temperature: number;
  temperature2?: number;
  humidity?: number;
  feels?: number;
};

export const EntrySchema: Schema<Document<EntrySchema>> = new Schema(
  {
    _id: {
      default: () => nanoid(),
      type: String,
    },
    station: {
      ref: 'Station',
      required: true,
      type: String,
    },
    hash: {
      required: true,
      type: String,
      unique: true,
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
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

EntrySchema.path('timestamp').get(
  (value: number) => value && new Date(value).toISOString()
);
EntrySchema.path('createdAt').get(
  (value: number) => value && new Date(value).toISOString()
);
EntrySchema.path('updatedAt').get(
  (value: number) => value && new Date(value).toISOString()
);

export default model<Document<EntrySchema>>('Entry', EntrySchema);
