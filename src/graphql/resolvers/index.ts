import { EntryMutation, EntryQuery } from './entry';
import { StationMutation, StationQuery } from './station';

export const Mutation = {
  ...EntryMutation,
  ...StationMutation,
};

export const Query = {
  ...EntryQuery,
  ...StationQuery,
};

export default {
  Mutation,
  Query,
};
