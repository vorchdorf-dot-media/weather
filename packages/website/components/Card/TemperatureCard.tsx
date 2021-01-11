import classnames from 'classnames';
import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'preact/hooks';
import { useText, Text } from 'preact-i18n';
import type { EntrySchema } from 'functions/dist/db/schemata/entry';
import type { StationSchema } from 'functions/dist/db/schemata/station';

import AlertIcon from 'assets/icons/alert.svg';
import ArrowUpRightIcon from 'assets/icons/arrow-up-right.svg';
import Card from 'components/Card/Card';
import { DAY } from 'utils/constants';
import { formatNumber } from 'utils/helpers';
import useLocale from 'utils/hooks/useLocale';

import styles from 'components/Card/TemperatureCard.module.scss';

export interface EntryProps extends EntrySchema {
  station: StationSchema;
}
export interface TemperatureCardProps {
  entry: EntryProps;
  link?: boolean;
  loading?: boolean;
  variant: 'grey' | 'primary' | 'secondary';
}

const TemperatureCard = ({
  link,
  loading,
  variant,
  entry: {
    timestamp,
    temperature,
    temperature2,
    humidity,
    feels,
    station: {
      id,
      name,
      config: {
        temperature: temperatureConfig,
        temperature2: temperature2Config,
      },
    },
  },
}: TemperatureCardProps): JSX.Element => {
  const temperatureId = useMemo(() => `temperature-${nanoid(3)}`, []);
  const { locale } = useRouter();
  const dayjs = useLocale(locale);
  const {
    feelsI18n,
    humidityI18n,
    lastUpdated,
    latestEntry,
    loadingLabel,
    temp,
    temp2,
    tempConfig,
    temp2Config,
    visit,
  } = useText({
    feelsI18n: 'temperature.feels',
    humidityI18n: 'temperature.humidity',
    lastUpdated: 'temperature.lastUpdated',
    latestEntry: <Text id="temperature.latestEntry" fields={{ name }} />,
    loading: 'loading',
    temp: 'temperature.temperature',
    temp2: 'temperature.temperature2',
    tempConfig: `temperature.config.${temperatureConfig}`,
    temp2Config: `temperature.config.${temperature2Config}`,
    visit: <Text id="stations.visit" fields={{ name }} />,
  });

  const ActivityIcon = dynamic(() => import('assets/icons/activity.svg'));

  return (
    <Card
      className={styles.wrapper}
      variant={variant}
      aria-labelledby={temperatureId}
    >
      {name && (
        <section className={classnames(styles.container, styles.header)}>
          <strong
            id={temperatureId}
            role="heading"
            aria-level={2}
            aria-label={latestEntry}
          >
            {name}
          </strong>
          {link && (
            <Link href={'/stations/' + encodeURIComponent(id)}>
              <a className={styles.link} title={visit}>
                <ArrowUpRightIcon />
              </a>
            </Link>
          )}
        </section>
      )}
      <div className={styles.values}>
        {!isNaN(temperature) && (
          <section className={styles.container}>
            <small role="heading" aria-level={3} className={styles.label}>
              {temp} ({tempConfig}):
            </small>
            <span className={styles.data}>
              {formatNumber(locale, temperature)}
              <sup>°C</sup>
            </span>
          </section>
        )}
        {!isNaN(temperature2) && (
          <>
            <section className={styles.container}>
              <small role="heading" aria-level={3} className={styles.label}>
                {temp2} ({temp2Config}):
              </small>
              <span className={styles.data}>
                {formatNumber(locale, temperature2)}
                <sup>°C</sup>
              </span>
            </section>
            <section className={styles.container}>
              <small role="heading" aria-level={3} className={styles.label}>
                {feelsI18n}:
              </small>
              <span className={styles.data}>
                {formatNumber(locale, feels)}
                <sup>°C</sup>
              </span>
            </section>
            <section className={styles.container}>
              <small role="heading" aria-level={3} className={styles.label}>
                {humidityI18n}:
              </small>
              <span className={styles.data}>
                {formatNumber(locale, humidity, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                <sup>%</sup>
              </span>
            </section>
          </>
        )}
      </div>
      {timestamp && (
        <div className={classnames(styles.container, styles.footer)}>
          <small>
            {lastUpdated}: {dayjs(timestamp).fromNow()}
            {new Date(timestamp).valueOf() < Date.now() - DAY && <AlertIcon />}
          </small>
        </div>
      )}
      {loading && (
        <div className={styles.svgContainer}>
          <ActivityIcon aria-label={loadingLabel} />
        </div>
      )}
    </Card>
  );
};

export default TemperatureCard;
