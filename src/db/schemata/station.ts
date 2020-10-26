import { Schema, model } from 'mongoose';
import { customAlphabet } from 'nanoid';

import { BASE_58, ID_SHORT } from '../../utils/definitions';

const nanoid = customAlphabet(BASE_58, ID_SHORT);

export interface AddressSchema {
  city?: string;
  country?: string;
  zip?: string;
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
  address?: AddressSchema,
  coordinates?: CoordinatesSchema,
}

const StationSchema: Schema<StationSchema> = new Schema({
  _id: {
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
  },
  address: {
    city: String,
    country: String,
    zip: String,
  },
  coordinates: {
    height: Number,
    latitude: Number,
    longitude: Number,
  },
});

export default model('Station', StationSchema);