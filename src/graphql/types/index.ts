import { gql } from 'apollo-server-lambda';

const types = gql`
  enum TemperatureConfig {
    IN
    OUT
  }

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

  type Station {
    id: ID!
    createdAt: Int
    updatedAt: Int
    name: String!
    email: String!
    address: Address
    coordinates: Coordinates
    config: StationConfig
  }

  type StationConfig {
    temperature: TemperatureConfig
    temperature2: TemperatureConfig
  }

  type StationInput {
    createdAt: Int
    updatedAt: Int
    name: String!
    email: String!
    address: Address
    coordinates: Coordinates
    config: StationConfig
  }

  type Query {
    entry(station: ID!): Entry
    entries(station: ID!, from: Int!, to: Int): [Entry]
    station(id: ID!): Station
    stations(): [Station]
  }

  type Mutation {
    createEntry(
      hash: String!
      timestamp: Int!
      temperature: [Float]
      humidity: Float
      feels: Float
    ): Entry!
    createStation(
      station: StationInput!
    ): Station!
  }
`;

export default types;
