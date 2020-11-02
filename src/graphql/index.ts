import { APIGatewayProxyEvent } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { DataSources } from 'apollo-server-core/src/graphqlOptions';

import connect from '../db';
import { EntryDataSource, StationDataSource } from './datasources';
import resolvers from './resolvers';
import typeDefs from './types';
import { RandomObject } from '../utils/definitions';

const server = new ApolloServer({
  context: async ({ event: { headers } }: { event: APIGatewayProxyEvent }) => ({
    db: await connect(),
    headers,
  }),
  dataSources: (): DataSources<RandomObject> => ({
    entries: new EntryDataSource(),
    stations: new StationDataSource(),
  }),
  playground: process.env.CONTEXT !== 'production',
  resolvers,
  typeDefs,
});

export default server.createHandler();
