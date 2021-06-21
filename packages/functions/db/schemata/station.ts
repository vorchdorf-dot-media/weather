import { Document, Schema, model } from 'mongoose';
import { customAlphabet } from 'nanoid';

import { BASE_58, ID_SHORT } from '../../utils/definitions';

const nanoid = customAlphabet(BASE_58, ID_SHORT);

export type AddressSchema = {
  city?: string;
  country?: string;
  street?: string;
  zip?: string;
};

export type ConfigSchema = {
  temperature?: 'IN' | 'OUT';
  temperature2?: 'IN' | 'OUT';
};

export type CoordinatesSchema = {
  height?: number;
  latitude: number;
  longitude: number;
};

export type StationSchema = {
  [key: string]: unknown;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  email: string;
  address?: AddressSchema;
  coordinates?: CoordinatesSchema;
  config?: ConfigSchema;
};

const StationSchema: Schema<Document<StationSchema>> = new Schema(
  {
    _id: {
      default: () => nanoid(),
      type: String,
    },
    name: {
      required: true,
      type: String,
      unique: true,
    },
    email: {
      required: true,
      type: String,
    },
    address: {
      city: String,
      country: String,
      street: String,
      zip: String,
    },
    coordinates: {
      height: Number,
      latitude: Number,
      longitude: Number,
    },
    config: {
      temperature: {
        default: () => 'OUT',
        type: String,
      },
      temperature2: {
        default: () => 'OUT',
        type: String,
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

StationSchema.path('createdAt').get(
  (value: number) => value && new Date(value).toISOString()
);
StationSchema.path('updatedAt').get(
  (value: number) => value && new Date(value).toISOString()
);

export default model<Document<StationSchema>>('Station', StationSchema);
