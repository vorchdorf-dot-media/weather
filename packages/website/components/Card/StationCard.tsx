import { useText, Text } from 'preact-i18n';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import useLocale from 'utils/hooks/useLocale';

import styles from 'components/Card/StationCard.module.css';

const StationCard = ({
  station,
  ['aria-level']: ariaLevel = 2,
}): JSX.Element => {
  const { locale } = useRouter();
  const dayjs = useLocale(locale);
  const { inside, outside } = useText({
    inside: 'stations.config.inside',
    outside: 'stations.config.outside',
  });
  const { __typename, ...stationConfig } = station?.config;

  const renderIcon = (config: 'IN' | 'OUT', sensor): JSX.Element => {
    if (!config) {
      return null;
    }
    const isInside = config === 'IN';
    const Icon = dynamic(
      () => import(`assets/icons/${isInside ? 'home' : 'signal'}.svg`)
    );
    return (
      <Icon
        aria-label={`Sensor #${sensor + 1}: ${isInside ? inside : outside}`}
        aria-hidden={null}
      />
    );
  };

  return (
    <section className={styles.station}>
      <span
        className={styles.heading}
        role={ariaLevel > 0 ? 'heading' : null}
        aria-level={ariaLevel > 0 ? ariaLevel : null}
      >
        {station.name}
      </span>
      <div className={styles.metaContainer}>
        {Object.keys(stationConfig).map(renderIcon)}
        <small className={styles.createdAt}>
          <Text
            id="stations.createdAt"
            fields={{ createdAt: dayjs(station.createdAt).fromNow() }}
          />
        </small>
      </div>
    </section>
  );
};

export default StationCard;
