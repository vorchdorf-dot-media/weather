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
  temperature: string[];
  humidity?: string;
  feels?: string;
  timestamp: string;
}): string => {
  const hash = createHash('sha1');
  hash.update(
    [
      station,
      Number(temperature).toFixed(2),
      Number(temperature2).toFixed(2),
      Number(humidity).toFixed(2),
      Number(feels).toFixed(2),
      timestamp,
    ]
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
