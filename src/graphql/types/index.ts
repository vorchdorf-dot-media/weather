import { gql } from 'apollo-server-lambda';

const types = gql`
  type Address {
    city: String
    country: String
    street: String
    zip: String
  }

  type Coordinates {
    height: Float
    latitutde: Float
    longitude: Float
  }

  type Entry {
    id: ID
    createdAt: Int
    updatedAt: Int
    station: Station
    hash: String
    timestamp: Int
    temperature: Float!
    temperature2: Float
    humidity: Float
    feels: Float
  }

  type EntryInput {
    id: ID!
    station: StationInput
    hash: String
    timestamp: Int
    temperature: Float!
    temperature2: Float
    humidity: Float
    feels: Float
  }

  type Station {
    id: ID
    createdAt: Int
    updatedAt: Int
    name: String!
    address: Address
    coordinates: Coordinates
  }

  type StationInput {
    id: ID!
    createdAt: Int
    updatedAt: Int
    name: String!
    address: Address
    coordinates: Coordinates
  }

  type Query {
    entry(station: ID!): Entry
    entries(station: ID!, from: Int!, to: Int): [Entry]
  }

  type Mutation {
    createEntry(
      hash: String!
      timestamp: Int!
      temperature: [Float]
      humidity: Float
      feels: Float
    ): EntryInput!
  }
`;

export default types;
