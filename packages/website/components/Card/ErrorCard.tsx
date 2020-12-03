import { useState } from 'preact/hooks';
import { useText } from 'preact-i18n';

import Card from 'components/Card/Card';
import AlertIcon from 'assets/icons/alert.svg';
import MoreIcon from 'assets/icons/more.svg';

import styles from 'components/Card/ErrorCard.module.css';

const ErrorCard = ({
  message,
  stack,
}: {
  message: string;
  stack?: string;
}): JSX.Element => {
  const [stackShown, setStackShown] = useState(false);
  const { error, showStack } = useText({
    error: 'error.title',
    showStack: 'error.showStack',
  });

  const toggleStack = (event): void => {
    event.preventDefault();
    return setStackShown(true);
  };

  return (
    <Card variant="secondary" className={styles.error}>
      <AlertIcon role="image" aria-hidden />
      <div className={styles.container}>
        <span role="heading" aria-level={2}>
          {error}
        </span>
        <span>{message}</span>
        {stackShown && <small>{stack}</small>}
      </div>
      {stack && !stackShown && (
        <button className={styles.button} onClick={toggleStack}>
          <MoreIcon aria-label={showStack} />
        </button>
      )}
    </Card>
  );
};

export default ErrorCard;
