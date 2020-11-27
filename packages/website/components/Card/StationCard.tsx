import { Text } from 'preact-i18n';
import { useRouter } from 'next/router';

import Card from 'components/Card/Card';
import useLocale from 'utils/hooks/useLocale';

import styles from 'components/Card/StationCard.module.css';

const StationCard = ({
  station,
  variant,
  ['aria-level']: ariaLevel = 2,
}): JSX.Element => {
  const { locale } = useRouter();
  const dayjs = useLocale(locale);
  return (
    <Card variant={variant}>
      <div>
        <span
          className={styles.heading}
          role={ariaLevel > 0 ? 'heading' : null}
          aria-level={ariaLevel > 0 ? ariaLevel : null}
        >
          {station.name}
        </span>
        <small>
          <Text
            id="stations.createdAt"
            fields={{ createdAt: dayjs(station.createdAt).fromNow() }}
          />
        </small>
      </div>
    </Card>
  );
};

export default StationCard;
