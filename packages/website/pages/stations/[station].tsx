import { useQuery } from '@urql/preact';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'preact/hooks';
import { translate, useText } from 'preact-i18n';

import TemperatureCard from 'components/Card/TemperatureCard';
import StationCard from 'components/Station/Station';
import ErrorPage from 'pages/_error';
import client from 'utils/graphql';
import { GET_LATEST_ENTRY, GET_STATION_PAGE_QUERY } from 'utils/queries';
import { EntrySchema } from 'functions/dist/db/schemata/entry';

import Divider from 'components/Divider';
import { DAY } from 'utils/constants';

const setTimeframe = () => new Date(Date.now() - DAY * 7).toISOString();

const Station = ({
  entry,
  stack,
  station,
  statusCode,
  title,
}: {
  entry: EntrySchema;
  stack: string;
  station: string;
  statusCode: number;
  title: string;
}): JSX.Element => {
  if (statusCode) {
    return <ErrorPage title={title} stack={stack} />;
  }

  const [from] = useState(setTimeframe);
  const { statistics } = useText({
    statistics: 'index.statistics',
  });

  const [stationData, reexecuteQuery] = useQuery({
    query: GET_STATION_PAGE_QUERY,
    variables: { station, from },
  });

  const refresh = () => {
    stationData.operation.variables.from = setTimeframe();
    reexecuteQuery({ requestPolicy: 'network-only' });
  };

  useEffect(() => {
    typeof window !== 'undefined' && window.addEventListener('focus', refresh);
    return () =>
      typeof window !== 'undefined' &&
      window.removeEventListener('focus', refresh);
  }, []);

  const TemperatureChart = dynamic(
    () => import('components/Chart/TemperatureChart')
  );

  return (
    <>
      <StationCard
        station={stationData?.data?.entry?.station || entry?.station}
        aria-level={1}
      />
      <TemperatureCard
        link={false}
        loading={stationData?.fetching}
        variant="primary"
        entry={stationData?.data?.entry || entry}
      />
      <Divider level={2}>{statistics}</Divider>
      {stationData?.data?.entries?.length > 0 && (
        <TemperatureChart
          data={stationData?.data?.entries}
          station={stationData?.data?.entry?.station}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { station },
  locale,
}) => {
  const dictionary = (await import(`locales/${locale}.json`)).default;
  try {
    const { data, error } = await client
      .query(GET_LATEST_ENTRY, { station })
      .toPromise();
    if (error) {
      throw new Error(error.message);
    }
    return {
      props: {
        description: translate('stations.description', '', dictionary, {
          station: data?.entry?.station?.name,
        }),
        entry: data?.entry,
        station,
        title: translate('stations.title', '', dictionary, {
          station: data?.entry?.station?.name,
        }),
      },
    };
  } catch (e) {
    return {
      props: {
        stack: e.message,
        statusCode: 404,
        title: translate('error.notFoundID', '', dictionary, { id: station }),
      },
    };
  }
};

export default Station;
