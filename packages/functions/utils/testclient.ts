import { createHash } from 'crypto';
import { ApolloServer, Config } from 'apollo-server-micro';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';

import { config } from '../apollo';

export const generateHash = ({
  station,
  temperature: [temperature, temperature2] = [],
  humidity,
  feels,
  timestamp,
}: {
  station: string;
  temperature: number[];
  humidity?: number;
  feels?: number;
  timestamp: number;
}): string => {
  const hash = createHash('sha1');
  hash.update(
    [station, temperature, temperature2, humidity, feels, timestamp]
      .filter(v => !!v)
      .join('')
  );
  return hash.digest('hex');
};

export const createTestServer = (
  customConfig: Config
): ApolloServerTestClient => {
  const server = new ApolloServer({
    ...config,
    ...customConfig,
  });
  return createTestClient(server as never);
};
