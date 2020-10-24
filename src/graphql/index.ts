import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';

import resolvers from './resolvers';
import typeDefs from './types';

const server = new ApolloServer({
  context: ({ event: { headers } }: { event: APIGatewayProxyEvent }) => ({
    headers,
  }),
  resolvers,
  typeDefs,
});

export default server.createHandler();
