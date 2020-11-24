import { useText } from 'preact-i18n';

import Card from 'components/Card/Card';

import styles from 'components/Card/LoadingCard.module.css';
import ActivityIcon from '../../assets/icons/activity.svg';

const LoadingCard = ({
  height = 150,
  variant,
}: {
  height?: number;
  variant: 'grey' | 'primary' | 'secondary';
}): JSX.Element => {
  const { loading } = useText('loading');

  return (
    <Card variant={variant}>
      <div style={{ minHeight: height }}>
        <svg width="100%" height="100%" className={styles.loading}>
          <defs>
            <linearGradient id="grad-2">
              <stop offset="0%"></stop>
              <stop offset="100%"></stop>
              <stop offset="0%"></stop>
              <animate
                attributeName="x1"
                from="-150%"
                to="150%"
                dur="3s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="x2"
                from="0%"
                to="300%"
                dur="3s"
                repeatCount="indefinite"
              ></animate>
            </linearGradient>
          </defs>
          <rect fill="url(#grad-2)"></rect>
        </svg>
        <span role="heading" aria-level={2} className={styles.heading}>
          <div className={styles.svgContainer} aria-hidden>
            <ActivityIcon />
          </div>
          {loading}
        </span>
      </div>
    </Card>
  );
};

export default LoadingCard;
