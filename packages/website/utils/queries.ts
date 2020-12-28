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

export const COUNT_ENTRIES = `
query entriesCount($station: ID, $from: String, $to: String) {
  entriesCount(station: $station, from: $from, to: $to)
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

export const COUNT_STATIONS = `
query stationsCount {
  stationsCount
}
`;

export const GET_STATIONS = `
query stations($name: String) {
  stations(name: $name) {
    ${station}
  }
}
`;

export const GET_INDEX_PAGE_QUERY = `
query indexPage($from: String) {
  entries: entriesCount
  stations: stationsCount
  highest: entryExtreme(from: $from) {
    ${entry}
  }
  lowest: entryExtreme(low: true, from: $from) {
    ${entry}
  }
}
`;
