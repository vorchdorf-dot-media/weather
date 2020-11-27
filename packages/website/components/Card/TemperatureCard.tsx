import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useText, Text } from 'preact-i18n';

import AlertIcon from 'assets/icons/alert.svg';
import ArrowUpRightIcon from 'assets/icons/arrow-up-right.svg';
import Card from 'components/Card/Card';
import { DAY } from 'utils/constants';
import useLocale from 'utils/hooks/useLocale';

import styles from 'components/Card/TemperatureCard.module.scss';

const TemperatureCard = ({
  link,
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
}): JSX.Element => {
  const { locale } = useRouter();
  const dayjs = useLocale(locale);
  const {
    feelsI18n,
    humidityI18n,
    lastUpdated,
    latestEntry,
    tempConfig,
    temp2Config,
  } = useText({
    feelsI18n: 'temperature.feels',
    humidityI18n: 'temperature.humidity',
    lastUpdated: 'temperature.lastUpdated',
    latestEntry: <Text id="temperature.latestEntry" fields={{ name }} />,
    tempConfig: `temperature.config.${temperatureConfig}`,
    temp2Config: `temperature.config.${temperature2Config}`,
  });

  const formatNumber = (
    number: number,
    options: Intl.NumberFormatOptions = {}
  ): string =>
    new Intl.NumberFormat(locale, {
      ...options,
    }).format(number);

  return (
    <Card variant={variant}>
      {name && (
        <div className={classnames(styles.container, styles.header)}>
          <span role="heading" aria-level={2} aria-label={latestEntry}>
            <strong>{name}</strong>
          </span>
          {link && (
            <Link href={'/stations/' + encodeURIComponent(id)}>
              <a className={styles.link}>
                <ArrowUpRightIcon />
              </a>
            </Link>
          )}
        </div>
      )}
      {temperature && (
        <div className={styles.container}>
          <small className={styles.label}>{tempConfig}:</small>
          <span className={styles.data}>
            {formatNumber(temperature)}
            <sup>°C</sup>
          </span>
        </div>
      )}
      {temperature2 && (
        <>
          <div className={styles.container}>
            <small className={styles.label}>{temp2Config}:</small>
            <span className={styles.data}>
              {formatNumber(temperature2)}
              <sup>°C</sup>
            </span>
          </div>
          <div className={styles.container}>
            <small className={styles.label}>{feelsI18n}:</small>
            <span className={styles.data}>
              {formatNumber(feels)}
              <sup>°C</sup>
            </span>
          </div>
          <div className={styles.container}>
            <small className={styles.label}>{humidityI18n}:</small>
            <span className={styles.data}>
              {formatNumber(humidity)}
              <sup>%</sup>
            </span>
          </div>
        </>
      )}
      {timestamp && (
        <small className={classnames(styles.container, styles.footer)}>
          {lastUpdated}: {dayjs(timestamp).fromNow()}
          {new Date(timestamp).valueOf() < Date.now() - DAY && <AlertIcon />}
        </small>
      )}
    </Card>
  );
};

export default TemperatureCard;
