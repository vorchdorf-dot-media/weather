import { useQuery } from '@urql/preact';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'preact/hooks';
import { translate, Text, useText } from 'preact-i18n';

import LoadingCard from 'components/Card/LoadingCard';
import SingleCard from 'components/Card/SingleCard';
import TemperatureCard from 'components/Card/TemperatureCard';
import StationCard from 'components/Station/Station';
import ErrorPage from 'pages/_error';
import client from 'utils/graphql';
import { GET_LATEST_ENTRY, GET_STATION_PAGE_QUERY } from 'utils/queries';
import type { EntrySchema } from 'functions/dist/db/schemata/entry';
import type { StationSchema } from 'functions/dist/db/schemata/station';

import Divider from 'components/Divider';
import { DAY } from 'utils/constants';
import { formatNumber } from 'utils/helpers';

import styles from 'assets/styles/station.module.css';

const DAYS = 7;

const setTimeframe = () => new Date(Date.now() - DAY * DAYS).toISOString();

const ExtremeCard = ({
  fetching,
  low,
  value,
}: {
  fetching: boolean;
  value: string;
  low?: boolean;
}): JSX.Element => {
  const variant = low ? 'primary' : 'secondary';
  return fetching ? (
    <LoadingCard className={styles.loading} variant={variant} height={116} />
  ) : (
    <SingleCard variant={variant}>
      <span role="heading" aria-level={4}>
        <strong>
          {value}
          <sup>°C</sup>
        </strong>
        <span>
          <Text id={`temperature.${low ? 'min' : 'max'}`} />
        </span>
      </span>
    </SingleCard>
  );
};

const Station = ({
  entry,
  locale,
  stack,
  station,
  statusCode,
  title,
}: {
  entry: EntrySchema;
  locale: string;
  stack: string;
  station: StationSchema;
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
  const { temperature, temperature2 } = station?.config;
  const hasOutsideSensor = temperature === 'OUT' || temperature2 === 'OUT';

  const [stationData, reexecuteQuery] = useQuery({
    query: GET_STATION_PAGE_QUERY,
    variables: { station: station.id, from },
  });
  const { data, fetching } = stationData;
  const { max: maxEntry, min: minEntry } = data || {};

  const max = () => {
    if (!hasOutsideSensor) {
      return;
    }
    const maxValue =
      temperature === 'OUT' && temperature2 === 'OUT'
        ? Math.max(maxEntry?.temperature, maxEntry?.temperature2)
        : temperature === 'OUT'
        ? maxEntry?.temperature
        : maxEntry?.temperature2;
    return formatNumber(locale, maxValue);
  };

  const min = () => {
    if (!hasOutsideSensor) {
      return;
    }
    const minValue =
      temperature === 'OUT' && temperature2 === 'OUT'
        ? Math.min(minEntry?.temperature, minEntry?.temperature2)
        : temperature === 'OUT'
        ? minEntry?.temperature
        : minEntry?.temperature2;
    return formatNumber(locale, minValue);
  };

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
      <StationCard station={data?.entry?.station || station} aria-level={1} />
      <TemperatureCard
        link={false}
        loading={fetching}
        variant="primary"
        entry={data?.entry || entry}
      />
      {hasOutsideSensor && (
        <article>
          <Divider level={2}>{statistics}</Divider>
          <section className={styles.meta}>
            {(!isNaN(data?.count) || !station?.createdAt) && fetching ? (
              <>
                <LoadingCard
                  className={styles.loading}
                  variant="grey"
                  height={116}
                />
                <LoadingCard
                  className={styles.loading}
                  variant="grey"
                  height={116}
                />
              </>
            ) : (
              <>
                <SingleCard variant="grey">
                  <span role="heading" aria-level={3}>
                    <strong>
                      {new Intl.DateTimeFormat(locale, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }).format(
                        Date.parse((station?.createdAt as unknown) as string)
                      )}
                    </strong>
                    <span>
                      <Text id="stations.registered" />
                    </span>
                  </span>
                </SingleCard>
                <SingleCard variant="grey">
                  <span role="heading" aria-level={3}>
                    <strong>{data?.count ?? 0}</strong>
                    <span>
                      <Text
                        id="temperature.entries"
                        plural={data?.count ?? 0}
                      />
                    </span>
                  </span>
                </SingleCard>
              </>
            )}
            <section className={styles.extremes}>
              <span role="heading" aria-level={3}>
                <Text
                  id="temperature.extremes.days"
                  fields={{ amount: DAYS }}
                />
              </span>
              <ExtremeCard fetching={fetching} value={max()} />
              <ExtremeCard fetching={fetching} value={min()} low />
            </section>
          </section>
          {data?.entries?.length > 0 && (
            <TemperatureChart
              data={data?.entries}
              station={data?.entry?.station}
            />
          )}
        </article>
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
        locale,
        station: data?.entry?.station,
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
