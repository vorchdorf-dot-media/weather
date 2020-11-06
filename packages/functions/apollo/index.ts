import { APIGatewayProxyEvent } from 'aws-lambda';
import { ApolloServer, Config } from 'apollo-server-lambda';
import { DataSources } from 'apollo-server-core/src/graphqlOptions';

import { EntryDataSource, StationDataSource } from './datasources';
import resolvers from './resolvers';
import typeDefs from './types';
import { RandomObject } from '../utils/definitions';

export const config: Config = {
  context: async ({ event: { headers } }: { event: APIGatewayProxyEvent }) => ({
    headers,
  }),
  dataSources: (): DataSources<RandomObject> => ({
    entries: new EntryDataSource(),
    stations: new StationDataSource(),
  }),
  playground: process.env.CONTEXT !== 'production',
  resolvers,
  typeDefs,
};

const server = new ApolloServer(config);

export default server.createHandler();
