import styles from 'components/Card/Card.module.css';
import type { ReactElement } from 'react';
import classnames from 'classnames';

export interface CardProps {
  children: ReactElement | ReactElement[];
  variant: 'grey' | 'primary' | 'secondary';
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const Card = ({
  children,
  className,
  variant,
  ...rest
}: CardProps): JSX.Element => (
  <article
    className={classnames(styles.card, styles[variant], className)}
    {...rest}
  >
    {children}
  </article>
);

export default Card;
