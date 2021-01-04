import { useQuery } from '@urql/preact';
import { GetServerSideProps } from 'next';
import { useEffect } from 'preact/hooks';
import { translate } from 'preact-i18n';

import TemperatureCard from 'components/Card/TemperatureCard';
import StationCard from 'components/Station/Station';
import ErrorPage from 'pages/_error';
import client from 'utils/graphql';
import { GET_LATEST_ENTRY } from 'utils/queries';
import { EntrySchema } from 'functions/dist/db/schemata/entry';
import { StationSchema } from 'functions/dist/db/schemata/station';
import LineChart from 'components/Chart/LineChart';

import mock from 'utils/mocks/entries.mock';

const Station = ({
  entry,
  stack,
  station,
  statusCode,
  title,
}: {
  entry: EntrySchema;
  stack: string;
  station: StationSchema;
  statusCode: number;
  title: string;
}): JSX.Element => {
  if (statusCode) {
    return <ErrorPage title={title} stack={stack} />;
  }
  const [result, reexecuteQuery] = useQuery({
    query: GET_LATEST_ENTRY,
    variables: { station },
  });

  const refresh = () => reexecuteQuery({ requestPolicy: 'network-only' });

  useEffect(() => {
    typeof window !== 'undefined' && window.addEventListener('focus', refresh);
    return () =>
      typeof window !== 'undefined' &&
      window.removeEventListener('focus', refresh);
  }, []);

  return (
    <>
      <StationCard
        station={result?.data?.entry?.station || entry?.station}
        aria-level={1}
      />
      <TemperatureCard
        link={false}
        loading={result?.fetching}
        variant="primary"
        entry={result?.data?.entry || entry}
      />
      <LineChart data={(mock.data.entries as unknown) as EntrySchema[]} />
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
