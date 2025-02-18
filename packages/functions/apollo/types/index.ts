import { gql } from 'apollo-server-micro';

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
    latitude: Float
    longitude: Float
  }

  type Entry {
    id: ID
    createdAt: String
    updatedAt: String
    station: Station
    hash: String
    timestamp: String
    temperature: Float!
    temperature2: Float
    humidity: Float
    feels: Float
  }

  type Station {
    name: ID!
    createdAt: String
    updatedAt: String
    email: String
    address: Address
    coordinates: Coordinates
    config: StationConfig
  }

  type StationConfig {
    temperature: TemperatureConfig
    temperature2: TemperatureConfig
  }

  input AddressInput {
    city: String
    country: String
    street: String
    zip: String
  }

  input CoordinatesInput {
    height: Float
    latitude: Float
    longitude: Float
  }

  input StationConfigInput {
    temperature: TemperatureConfig
    temperature2: TemperatureConfig
  }

  input StationInput {
    name: String!
    email: String!
    address: AddressInput
    coordinates: CoordinatesInput
    config: StationConfigInput
  }

  type Query {
    entry(station: ID!): Entry
    entryExtreme(low: Boolean, station: ID, from: String, to: String): Entry
    entries(station: ID!, from: String!, to: String): [Entry]
    entriesCount(station: ID, from: String, to: String): Int
    station(name: ID!): Station
    stations(name: String): [Station]
    stationsCount: Int
  }

  type Mutation {
    createEntry(
      hash: String!
      timestamp: Int!
      temperature: [Float]
      humidity: Float
      feels: Float
    ): Entry!
    createStation(station: StationInput!): Station!
  }
`;

export default types;
