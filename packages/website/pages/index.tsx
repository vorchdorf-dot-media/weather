import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { translate, useText, Text } from 'preact-i18n';
import { useQuery } from '@urql/preact';

import { Card, LoadingCard } from 'components/Card';
import Divider from 'components/Divider';
import StationForm from 'components/StationForm/StationForm';

import styles from 'assets/styles/index.module.css';

const Index = ({ title }) => {
  const [{ data, fetching, error }] = useQuery({
    query: `{ entriesCount stationsCount }`,
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
              <strong>{data?.stationsCount}</strong>
              <span>
                <Text id="stations.stations" plural={data?.stationsCount} />
              </span>
            </span>
          </Card>
        )}
        {fetching ? (
          <LoadingCard className={styles.card} height={120} variant="grey" />
        ) : (
          <Card className={styles.card} variant="grey">
            <span role="heading" aria-level={3}>
              <strong>{data?.entriesCount}</strong>
              <span>
                <Text id="temperature.entries" plural={data?.entriesCount} />
              </span>
            </span>
          </Card>
        )}
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translation = (await import(`locales/${locale}.json`)).default;
  return {
    props: {
      description: translate('site.description', '', translation),
      title: translate('index.title', '', translation),
    },
  };
};

export default Index;
