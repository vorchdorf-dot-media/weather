import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'preact/hooks';
import { translate, useText, Text } from 'preact-i18n';
import { useQuery } from '@urql/preact';

import { Card, LoadingCard } from 'components/Card';
import Divider from 'components/Divider';
import StationForm from 'components/StationForm/StationForm';
import { GET_INDEX_PAGE_QUERY } from 'utils/queries';
import { DAY } from 'utils/constants';
import { formatNumber } from 'utils/helpers';

import styles from 'assets/styles/index.module.css';

const Index = ({ locale, title }) => {
  const [time] = useState(Date.now());
  const [{ data, fetching, error }] = useQuery({
    query: GET_INDEX_PAGE_QUERY,
    variables: { from: new Date(time - DAY).toISOString() },
  });
  const { graphic, headline, statistics } = useText({
    graphic: 'index.graphic.caption',
    headline: 'index.headline',
    statistics: 'index.statistics',
  });
  const ArduinoGraphic = dynamic(() => import('assets/graphics/arduino.svg'));
  return (
    <>
      <StationForm />
      <article className={styles.container}>
        <div>
          <h1>{title}</h1>
          <p>{headline}</p>
        </div>
        <figure>
          <ArduinoGraphic aria-label={graphic} />
          <figcaption>{graphic}</figcaption>
        </figure>
      </article>
      <section className={styles.statistics}>
        <Divider className={styles.divider} level={2}>
          {statistics}
        </Divider>
        {fetching ? (
          <LoadingCard className={styles.card} height={120} variant="grey" />
        ) : (
          <Card className={styles.card} variant="grey">
            <span role="heading" aria-level={3}>
              <strong>{data?.stations}</strong>
              <span>
                <Text id="stations.stations" plural={data?.stations} />
              </span>
            </span>
          </Card>
        )}
        {fetching ? (
          <LoadingCard className={styles.card} height={120} variant="grey" />
        ) : (
          <Card className={styles.card} variant="grey">
            <span role="heading" aria-level={3}>
              <strong>{data?.entries}</strong>
              <span>
                <Text id="temperature.entries" plural={data?.entries} />
              </span>
            </span>
          </Card>
        )}
        <section className={styles.temperatureStatistics}>
          <span role="heading" aria-level={3}>
            <Text
              id="temperature.extremes"
              fields={{ amount: Math.floor(DAY / 3600000) }}
            />
          </span>
          {fetching ? (
            <LoadingCard
              className={styles.card}
              height={120}
              variant="secondary"
            />
          ) : (
            <Card className={styles.card} variant="secondary">
              <span role="heading" aria-level={4}>
                <strong>
                  {formatNumber(
                    locale,
                    Math.max(
                      data?.highest?.temperature,
                      data?.highest?.temperature2
                    )
                  )}
                  <sup>°C</sup>
                </strong>
                <span>
                  <Text id="temperature.max" />
                </span>
              </span>
            </Card>
          )}
          {fetching ? (
            <LoadingCard
              className={styles.card}
              height={120}
              variant="primary"
            />
          ) : (
            <Card className={styles.card} variant="primary">
              <span role="heading" aria-level={4}>
                <strong>
                  {formatNumber(
                    locale,
                    Math.min(
                      data?.lowest?.temperature,
                      data?.lowest?.temperature2
                    )
                  )}
                  <sup>°C</sup>
                </strong>
                <span>
                  <Text id="temperature.min" />
                </span>
              </span>
            </Card>
          )}
        </section>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translation = (await import(`locales/${locale}.json`)).default;
  return {
    props: {
      description: translate('site.description', '', translation),
      locale,
      title: translate('index.title', '', translation),
    },
  };
};

export default Index;
