import { ApolloServer } from 'apollo-server-lambda';

const server = new ApolloServer({
  typeDefs: null,
  resolvers: null,
});

export const handler = server.createHandler();
