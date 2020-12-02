import { IncomingMessage } from 'http';
import { ApolloServer, Config } from 'apollo-server-micro';
import { DataSources } from 'apollo-server-core/src/graphqlOptions';

import { EntryDataSource, StationDataSource } from './datasources';
import resolvers from './resolvers';
import typeDefs from './types';
import { RandomObject } from '../utils/definitions';
import connect from '../db';

export const config: Config = {
  context: async ({ headers }: IncomingMessage) => {
    const { connection } = await connect();
    return {
      connection,
      headers,
    };
  },
  dataSources: (): DataSources<RandomObject> => ({
    entries: new EntryDataSource(),
    stations: new StationDataSource(),
  }),
  playground: process.env.CONTEXT !== 'production',
  resolvers,
  typeDefs,
};

const server = new ApolloServer(config);

export default server.createHandler({ path: '/api/graphql' });
