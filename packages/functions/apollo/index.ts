import { IncomingMessage } from 'http';
import type { Connection } from 'mongoose';
import { ApolloServer, Config } from 'apollo-server-micro';
import { DataSources } from 'apollo-server-core/src/graphqlOptions';

import { EntryDataSource, StationDataSource } from './datasources';
import resolvers from './resolvers';
import typeDefs from './types';
import { RandomObject } from '../utils/definitions';
import connect from '../db';

let connection: Connection;

export const config: Config = {
  context: async ({ req: { headers } }: { req: IncomingMessage }) => {
    connection = await connect().then(({ connection }) => connection);
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
  plugins: [
    {
      requestDidStart() {
        return {
          willSendResponse: async () => connection && connection.close(),
        };
      },
    },
  ],
  resolvers,
  typeDefs,
};

const server = new ApolloServer(config);

export default server.createHandler({ path: '/api/graphql' });
