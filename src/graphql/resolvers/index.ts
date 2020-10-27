import { AuthenticationError } from 'apollo-server-lambda';

import { Entry } from '../../db/schemata';
import { scope } from '../../utils/authorization';
import {
  AUTH_SCOPE,
  RandomObject,
  StringObject,
} from '../../utils/definitions';

export const Mutation = {
  createEntry: async (
    parent: any,
    args: RandomObject = {},
    context: { headers: StringObject }
  ): Promise<RandomObject> => {
    const { authorization } = context.headers || {};

    if ((await scope(authorization)) < AUTH_SCOPE.STATION) {
      throw new AuthenticationError('Unauthorized');
    }
    return {};
  },
};

export const Query = {
  entry: async (
    parent: any,
    args: RandomObject = {}
  ): Promise<RandomObject> => {
    const { station } = args;

    const [entry] =
      (await Entry.find({ station }).sort('-timestamp').limit(1)) || [];
    return entry && entry.toJSON();
  },
  entries: async (
    parent: any,
    args: RandomObject = {}
  ): Promise<RandomObject[]> => {
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
};

export default {
  Mutation,
  Query,
};
