import { gql } from 'apollo-server-lambda';

const address = `
  city
  country
  street
  zip
`;

const coordinates = `
  height
  latitude
  longitude
`;

const config = `
  temperature
  temperature2
`;

const dates = `
  createdAt
  updatedAt
`;

const station = `
  id
  name
  email
  ${dates}
  address {
    ${address}
  }
  coordinates {
    ${coordinates}
  }
  config {
    ${config}
  }
`;

const entry = `
  id
  hash
  temperature
  temperature2
  humidity
  feels
  ${dates}
  station {
    ${station}
  }
`;

export const CREATE_ENTRY = gql`
  mutation createEntry(
    $hash: String!
    $timestamp: Int!
    $temperature: [Float]
    $humidity: Float
    $feels: Float
  ) {
    createEntry(
      hash: $hash
      timestamp: $timestamp
      temperature: $temperature
      humidity: $humidity
      feels: $feels
    ) {
      ${entry}
    }
  }
`;

export const GET_ENTRY = gql`
  query entry($station: ID!) {
    entry(station: $station) {
      ${entry}
    }
  }
`;

export const CREATE_STATION = gql`
  mutation createStation($station: StationInput!) {
    createStation(station: $station) {
      ${station}
    }
  }
`;
