const address = `
city
country
street
zip
`;

const config = `
temperature
temperature2
`;

const coordinates = `
height
latitude
longitude
`;

const station = `
createdAt
updatedAt
email
id
name
address {
  ${address}
}
config {
  ${config}
}
coordinates {
  ${coordinates}
}
`;

const entry = `
createdAt
updatedAt
id
hash
timestamp
temperature
temperature2
humidity
feels
station {
  ${station}
}
`;

export const GET_ENTRIES = `
query entries($station: ID!, $from: String!, $to: String) {
  entries(station: $station, from: $from, to: $to) {
    hash
    timestamp
    temperature
    temperature2
    humidity
    feels
  }
}
`;

export const GET_LATEST_ENTRY = `
query entry($station: ID!) {
  entry(station: $station) {
    ${entry}
  }
}
`;

export const GET_STATIONS = `
query stations {
  stations {
    ${station}
  }
}
`;
