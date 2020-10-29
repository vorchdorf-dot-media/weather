import { AuthenticationError } from 'apollo-server-lambda';

import { Entry, Station } from '../../db/schemata';
import { StationSchema } from '../../db/schemata/station';
import { EntrySchema } from '../../db/schemata/entry';
import { scope, validateHash } from '../../utils/authorization';
import {
  AUTH_SCOPE,
  EntryInput,
  RandomObject,
  StringObject,
} from '../../utils/definitions';

export const Mutation = {
  createEntry: async (
    parent: any,
    args: EntryInput,
    context: { headers: StringObject }
  ): Promise<EntrySchema> => {
    const { authorization } = context.headers || {};
    const {
      hash,
      temperature: [temperature, temperature2] = [],
      humidity,
      feels,
    } = args;

    if ((await scope(authorization)) !== AUTH_SCOPE.STATION) {
      throw new AuthenticationError('Unauthorized');
    }

    const station = validateHash(authorization, args);

    if (!station) {
      throw new AuthenticationError('Hash check failed!');
    }

    const entry = await Entry.create({
      hash,
      station,
      temperature,
      temperature2,
      humidity,
      feels,
    });

    return entry.toJSON();
  },
  createStation: async (
    parent: any,
    args: { station: RandomObject } = { station: {} },
    context: { headers: StringObject }
  ): Promise<StationSchema> => {
    const { authorization } = context.headers || {};
    const { station: data } = args;

    if ((await scope(authorization)) < AUTH_SCOPE.ADMIN) {
      throw new AuthenticationError('Unauthorized');
    }

    const station = await Station.create({
      ...data,
    });

    return station.toJSON();
  },
};

export const Query = {
  entry: async (parent: any, args: RandomObject = {}): Promise<EntrySchema> => {
    const { station } = args;

    const [entry] =
      (await Entry.find({ station }).sort('-timestamp').limit(1)) || [];
    return entry && entry.toJSON();
  },
  entries: async (
    parent: any,
    args: RandomObject = {}
  ): Promise<EntrySchema[]> => {
    const { station, from, to = Date.now() } = args;

    const entries = await Entry.find({
      $and: [
        { station },
        { $gt: { timestamp: from } },
        { $lte: { timestamp: to } },
      ],
    });
    return entries.length && entries.map(e => e.toJSON());
  },
  station: async (
    parent: any,
    args: RandomObject = {}
  ): Promise<StationSchema> => {
    const { id } = args;

    const station = await Station.findById(id);
    return station.toJSON();
  },
  stations: async (
    parent: any,
    args: RandomObject = {}
  ): Promise<StationSchema[]> => {
    const stations = await Station.find({});
    return stations.length && stations.map(s => s.toJSON());
  },
};

export default {
  Mutation,
  Query,
};
