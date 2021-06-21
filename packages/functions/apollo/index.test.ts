/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServerTestClient } from 'apollo-server-testing';
import * as day from 'dayjs';
import { Document } from 'mongoose';

import {
  CREATE_ENTRY,
  CREATE_STATION,
  GET_ENTRIES,
  GET_ENTRY,
  GET_STATION,
  GET_STATIONS,
} from './queries';
import connect from '../db';
import { Station } from '../db/schemata';
import { StationSchema } from '../db/schemata/station';
import { createTestServer, generateHash } from '../utils/testclient';
import { RandomObject } from '../utils/definitions';

describe('Apollo GraphQL Server', () => {
  const TEST_STATION = {
    email: 'testClientStation@mail.com',
    name: 'testClientStation',
  };

  const ENTRY_DATA: RandomObject = {
    timestamp: Math.floor(Date.now() * 0.001),
    temperature: [22.7, 22.53],
    humidity: 60.0,
    feels: 22.61,
  };

  describe('with Admin User', () => {
    let ENTRY_HASH: string;
    let client: ApolloServerTestClient;
    let createStation: StationSchema;
    let errors: unknown;

    beforeAll(async () => {
      await connect();
      client = createTestServer({
        context: {
          headers: {
            authorization:
              'Basic ' +
              Buffer.from(
                process.env.ADMIN_USER + ':' + process.env.ADMIN_PASSWORD
              ).toString('base64'),
          },
        },
      });

      const station = await client.mutate({
        mutation: CREATE_STATION,
        variables: { station: TEST_STATION },
      });

      createStation = station.data.createStation;
      errors = station.errors;

      ENTRY_DATA.station = createStation.name;
      ENTRY_HASH = generateHash({ ...(ENTRY_DATA as any) });
    });

    it('creates a Station', () => {
      expect(errors).not.toBeDefined();
      expect(createStation).toHaveProperty('email', TEST_STATION.email);
      expect(createStation).toHaveProperty('name', TEST_STATION.name);
    });

    it('fetches a Station', async () => {
      const {
        data: { station },
        errors,
      } = await client.query({
        query: GET_STATION,
        variables: { name: createStation.name },
      });

      expect(errors).not.toBeDefined();
      expect(station).toEqual(createStation);
    });

    it('fails to create entry without Station credentials', async () => {
      const {
        data,
        errors: [
          {
            extensions: { code },
          },
        ],
      } = await client.mutate({
        mutation: CREATE_ENTRY,
        variables: {
          ...ENTRY_DATA,
          hash: ENTRY_HASH,
        },
      });

      expect(code).toEqual('UNAUTHENTICATED');
      expect(data).toEqual(null);
    });
  });

  describe('with Station user', () => {
    let ENTRY_HASH: string;
    let client: ApolloServerTestClient;
    let station: Document;

    beforeAll(async () => {
      await connect();
      station = await Station.create({
        email: 'testClientStationUser@mail.com',
        name: 'testClientStationUser',
      });

      ENTRY_HASH = generateHash({
        ...ENTRY_DATA,
        station: station._id,
      } as any);

      client = createTestServer({
        context: {
          headers: {
            authorization:
              'Basic ' +
              Buffer.from(station._id + ':' + ENTRY_HASH).toString('base64'),
          },
        },
      });
    });

    it('creates an Entry', async () => {
      const {
        data: { createEntry },
        errors,
      } = await client.mutate({
        mutation: CREATE_ENTRY,
        variables: {
          ...ENTRY_DATA,
          hash: ENTRY_HASH,
        },
      });

      expect(errors).not.toBeDefined();
      expect(createEntry.hash).toEqual(ENTRY_HASH);
      expect(createEntry.station.name).toEqual(station.get('name'));
    });

    it('fetches latest Entry', async () => {
      const {
        data: { entry },
        errors,
      } = await client.query({
        query: GET_ENTRY,
        variables: { station: station.get('name') },
      });

      expect(errors).not.toBeDefined();
      expect(entry.hash).toEqual(ENTRY_HASH);
    });

    it('fetches available Entries', async () => {
      const from = day().subtract(1, 'day').format('YYYY-MM-DD');

      const {
        data: { entries },
        errors,
      } = await client.query({
        query: GET_ENTRIES,
        variables: { station: station.get('name'), from },
      });

      expect(errors).not.toBeDefined();
      expect(entries.length).toBeGreaterThan(0);
    });

    it('fetches available Entries too far in the past', async () => {
      const from = day().subtract(1, 'month').format('YYYY-MM-DD');
      const to = day().subtract(1, 'day').format('YYYY-MM-DD');

      const {
        data: { entries },
        errors,
      } = await client.query({
        query: GET_ENTRIES,
        variables: { station: station.get('name'), from, to },
      });

      expect(errors).not.toBeDefined();
      expect(entries).toHaveLength(0);
    });

    it('fails to create Entry with invalid hash', async () => {
      const { data, errors } = await client.mutate({
        mutation: CREATE_ENTRY,
        variables: { ...ENTRY_DATA, hash: Buffer.from('asdf').toString('hex') },
      });

      expect(data).toBeNull();
      expect(errors).toBeDefined();
    });
  });

  describe('with unauthenticated user', () => {
    let client: ApolloServerTestClient;

    beforeAll(async () => {
      await connect();
      client = createTestServer({
        context: {
          headers: {},
        },
      });
    });

    it('fetches available Stations', async () => {
      const {
        data: { stations },
        errors,
      } = await client.query({
        query: GET_STATIONS,
      });

      expect(errors).not.toBeDefined();
      expect(stations.length).toBeGreaterThan(0);
    });

    it('fails to create a new Station', async () => {
      const {
        data,
        errors: [
          {
            extensions: { code },
          },
        ],
      } = await client.mutate({
        mutation: CREATE_STATION,
        variables: {
          station: {
            email: 'unauthenticatedStationCreate@mail.com',
            name: 'unauthenticatedStationCreate',
          },
        },
      });

      expect(data).toBeNull();
      expect(code).toEqual('UNAUTHENTICATED');
    });
  });
});
