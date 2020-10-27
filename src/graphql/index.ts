import { APIGatewayProxyEvent } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';

import connect from '../db';
import resolvers from './resolvers';
import typeDefs from './types';

const server = new ApolloServer({
  context: async ({ event: { headers } }: { event: APIGatewayProxyEvent }) => ({
    db: await connect(),
    headers,
  }),
  playground: process.env.CONTEXT !== 'production',
  resolvers,
  typeDefs,
});

export default server.createHandler();
