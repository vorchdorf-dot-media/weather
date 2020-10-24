import { gql } from 'apollo-server-lambda';

const types = gql`
  type Query {
    hello: String
  }
`;

export default types;