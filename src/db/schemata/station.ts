import { Schema, model } from 'mongoose';
import { customAlphabet } from 'nanoid';

import { BASE_58, ID_SHORT } from '../../utils/definitions';

const nanoid = customAlphabet(BASE_58, ID_SHORT);

export interface AddressSchema {
  city?: string;
  country?: string;
  street?: string;
  zip?: string;
}

export interface ConfigSchema {
  temperature?: 'IN' | 'OUT';
  temperatur2?: 'IN' | 'OUT';
}

export interface CoordinatesSchema {
  height?: number;
  latitutde: number;
  longitude: number;
}

export interface StationSchema {
  _id: string;
  createdAt: Date;
  updatedAt?: Date;
  name: string;
  email: string;
  address?: AddressSchema;
  coordinates?: CoordinatesSchema;
  config?: ConfigSchema;
}

const StationSchema: Schema<StationSchema> = new Schema({
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
});

export default model('Station', StationSchema);
