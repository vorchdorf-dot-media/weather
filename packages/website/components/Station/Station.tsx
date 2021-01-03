import { useText, Text } from 'preact-i18n';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { StationSchema } from 'functions/dist/db/schemata/station';
import useLocale from 'utils/hooks/useLocale';

import styles from 'components/Station/Station.module.css';

const StationCard = ({
  station,
  ['aria-level']: ariaLevel = 2,
}: {
  station: StationSchema;
  ['aria-level']?: number;
}): JSX.Element => {
  const { locale } = useRouter();
  const dayjs = useLocale(locale);
  const { inside, outside, x } = useText({
    inside: 'stations.config.inside',
    outside: 'stations.config.outside',
    x: 'stations.config.x',
  });
  const { temperature, temperature2 } = station?.config;

  const renderIcon = (config: 'IN' | 'OUT', sensor): JSX.Element => {
    let icon: string = null;
    let msg: string = null;
    switch (config) {
      case 'IN':
        icon = 'home';
        msg = inside;
        break;
      case 'OUT':
        icon = 'signal';
        msg = outside;
        break;
      default:
        icon = 'x';
        msg = x;
    }
    const Icon = dynamic(() => import(`assets/icons/${icon}.svg`));
    return (
      <Icon aria-label={`Sensor #${sensor + 1}: ${msg}`} aria-hidden={null} />
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
        {[temperature, temperature2].map(renderIcon)}
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
