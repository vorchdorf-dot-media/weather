import classnames from 'classnames';
import type { ReactElement } from 'react';

import Card from 'components/Card/Card';

import styles from 'components/Card/SingleCard.module.css';

const ExtremeCard = ({
  children,
  className,
  variant,
}: {
  children: ReactElement | ReactElement[];
  className?: string;
  variant?: 'grey' | 'primary' | 'secondary';
}): JSX.Element => {
  return (
    <Card className={classnames(className, styles.card)} variant={variant}>
      {children}
    </Card>
  );
};

export default ExtremeCard;
